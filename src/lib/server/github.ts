import { error } from '@sveltejs/kit';

const API_URL = 'https://api.github.com/graphql';

// --- GraphQL Response Types ---

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface RepositoryNode {
  name: string;
  url: string;
  owner: {
    login: string;
  };
  isPrivate: boolean;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

interface CommitContributionsByRepository {
  repository: RepositoryNode;
  contributions: {
    totalCount: number;
    nodes: {
      occurredAt: string;
    }[];
  };
}

interface ContributionsCollection {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  totalIssueContributions: number;
  contributionCalendar: ContributionCalendar;
  commitContributionsByRepository: CommitContributionsByRepository[];
  pullRequestContributions: {
    nodes: {
      pullRequest: {
        title: string;
        state: string;
        additions: number;
        deletions: number;
        repository: {
          name: string;
          url: string;
          stargazerCount: number;
          isPrivate: boolean;
          owner: {
            login: string;
            avatarUrl: string;
          };
          primaryLanguage: {
            name: string;
            color: string;
          } | null;
        };
      };
    }[];
  };
}

interface Viewer {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string;
  contributionsCollection: ContributionsCollection;
}

interface GitHubQueryResponse {
  viewer: Viewer;
}

interface CommitHistory {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: { committedDate: string }[];
}

interface RepoHistoryResponse {
  repository?: {
    defaultBranchRef?: {
      target?: {
        history?: CommitHistory;
      };
    };
  };
}

// --- App Data Types ---

export interface GithubStats {
  user: {
    login: string;
    avatarUrl: string;
    name: string;
  };
  year: number;
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalReviewContributions: number;
  totalIssueContributions: number;
  contributionsByDay: {
    date: string;
    count: number;
    level: string; // FIRST_QUARTILE, etc.
  }[];
  peakDay: {
    date: string;
    count: number;
    topRepo?: string;
  };
  commitHoursUTC: number[];
  topLanguages: {
    name: string;
    count: number;
    color: string;
  }[];
  topRepositories: {
    name: string;
    owner: string;
    commits: number;
    language: string | null;
    languageColor: string | null;
    isPrivate: boolean;
    url: string;
  }[];
  openSourceStats: {
    totalPrs: number;
    mergedPrs: number;
    projectStats: {
      name: string;
      owner: string;
      ownerAvatarUrl: string;
      url: string;
      stars: number;
      prsCount: number;
      mergedCount: number;
      additions: number;
      deletions: number;
      language: string | null;
      languageColor: string | null;
    }[];
  };
}

// --- Functions ---

async function fetchGraphQL<T>(
  token: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    const text = await response.text();
    throw error(response.status, `GitHub API Error: ${text}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors) {
    throw error(500, `GraphQL Query Error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw error(500, 'No data returned from GitHub');
  }

  return json.data;
}

export async function getGithubStats(
  token: string,
  year: number,
  includePrivate = true,
  ossMinStars = 0,
  ossIncludeOwn = true
): Promise<GithubStats> {
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const queryBody = `
      viewer {
        id
        login
        name
        avatarUrl
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalIssueContributions

          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }

          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              name
              url
              owner {
                login
              }
              isPrivate
              primaryLanguage {
                name
                color
              }
            }
            contributions(first: 100) {
              totalCount
              nodes {
                occurredAt
              }
            }
          }

          pullRequestContributions(first: 100, orderBy: {direction: DESC}) {
            nodes {
              pullRequest {
                title
                state
                additions
                deletions
                repository {
                  name
                  url
                  stargazerCount
                  isPrivate
                  owner {
                    login
                    avatarUrl
                  }
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
  `;

  const mainQuery = `query($from: DateTime!, $to: DateTime!) { ${queryBody} }`;

  // Fetch Main Data (Full Year)
  const mainData = await fetchGraphQL<GitHubQueryResponse>(token, mainQuery, { from, to });
  const viewer = mainData.viewer;
  const collection = viewer.contributionsCollection;

  // Process Contributions by Day
  let totalCommitContributions = collection.totalCommitContributions;
  let totalPullRequestContributions = collection.totalPullRequestContributions;
  let totalReviewContributions = collection.totalPullRequestReviewContributions;
  let totalIssueContributions = collection.totalIssueContributions;

  const authorId = viewer.id;
  const commitHoursUTC = Array.from<number>({ length: 24 }).fill(0);
  const historyQuery = `
    query($owner: String!, $name: String!, $authorId: ID!, $from: GitTimestamp!, $to: GitTimestamp!, $after: String) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100, author: {id: $authorId}, since: $from, until: $to, after: $after) {
                pageInfo { hasNextPage endCursor }
                nodes { committedDate }
              }
            }
          }
        }
      }
    }
  `;
  for (const item of collection.commitContributionsByRepository) {
    const repo = item.repository;
    if (!includePrivate && repo.isPrivate) continue;
    const owner = repo.owner.login;
    const name = repo.name;
    let after: string | undefined = undefined;
    while (true) {
      let histData: RepoHistoryResponse | null = null;
      try {
        histData = await fetchGraphQL<RepoHistoryResponse>(token, historyQuery, {
          owner,
          name,
          authorId,
          from,
          to,
          after
        });
      } catch {
        break;
      }
      const repoNode = histData?.repository;
      const branch = repoNode?.defaultBranchRef;
      const target = branch?.target as { history?: CommitHistory } | undefined;
      const history = target?.history ?? null;
      if (!history) break;
      for (const node of history.nodes) {
        const d = new Date(node.committedDate);
        const h = d.getUTCHours();
        commitHoursUTC[h]++;
      }
      if (history.pageInfo.hasNextPage && history.pageInfo.endCursor) {
        after = history.pageInfo.endCursor || undefined;
      } else {
        break;
      }
    }
  }

  if (!includePrivate) {
    // Recalculate Commits from Public Repos (Top 100)
    const publicCommits = collection.commitContributionsByRepository
      .filter((node) => !node.repository.isPrivate)
      .reduce((sum, node) => sum + node.contributions.totalCount, 0);

    totalCommitContributions = publicCommits;

    // Filter public PRs (Top 100)
    const publicPRs = collection.pullRequestContributions.nodes.filter(
      (node) => !node.pullRequest.repository.isPrivate
    ).length;

    totalPullRequestContributions = publicPRs;

    totalReviewContributions = 0;
    totalIssueContributions = 0;
  }

  const contributionsByDay: GithubStats['contributionsByDay'] = [];
  let peakDay = { date: '', count: 0 };

  for (const week of collection.contributionCalendar.weeks) {
    for (const day of week.contributionDays) {
      contributionsByDay.push({
        date: day.date,
        count: day.contributionCount,
        level: day.contributionLevel
      });
      if (day.contributionCount > peakDay.count) {
        peakDay = { date: day.date, count: day.contributionCount };
      }
    }
  }

  // Process Top Repositories
  let topRepositories = collection.commitContributionsByRepository
    .map((node) => ({
      name: node.repository.name,
      owner: node.repository.owner.login,
      commits: node.contributions.totalCount,
      language: node.repository.primaryLanguage?.name ?? null,
      languageColor: node.repository.primaryLanguage?.color ?? null,
      isPrivate: node.repository.isPrivate,
      url: node.repository.url
    }))
    .sort((a, b) => b.commits - a.commits);

  if (!includePrivate) {
    topRepositories = topRepositories.filter((repo) => !repo.isPrivate);
  }

  const peakDayStats = {
    ...peakDay,
    topRepo: topRepositories.length > 0 ? topRepositories[0].name : undefined
  };

  // Process Top Languages (weighted by commit count)
  const languageMap = new Map<string, { count: number; color: string }>();
  for (const repo of topRepositories) {
    if (repo.language) {
      const current = languageMap.get(repo.language) || { count: 0, color: repo.languageColor! };
      languageMap.set(repo.language, {
        count: current.count + repo.commits,
        color: current.color
      });
    }
  }

  const topLanguages = Array.from(languageMap.entries())
    .map(([name, { count, color }]) => ({ name, count, color }))
    .sort((a, b) => b.count - a.count);

  // Process Open Source Stats
  const prNodes = collection.pullRequestContributions.nodes;
  const ossProjectMap = new Map<
    string,
    {
      name: string;
      owner: string;
      ownerAvatarUrl: string;
      url: string;
      stars: number;
      prsCount: number;
      mergedCount: number;
      additions: number;
      deletions: number;
      language: string | null;
      languageColor: string | null;
    }
  >();

  let totalPrs = 0;
  let mergedPrs = 0;

  for (const node of prNodes) {
    const repo = node.pullRequest.repository;

    // Filter: Must be public
    // Always exclude private for OSS stats regardless of includePrivate flag (OSS implies public usually)
    if (repo.isPrivate) continue;

    // Filter: Min stars
    if (repo.stargazerCount < ossMinStars) continue;

    // Filter: Include own?
    if (!ossIncludeOwn && repo.owner.login === viewer.login) continue;

    totalPrs++;
    if (node.pullRequest.state === 'MERGED') {
      mergedPrs++;
    }

    const key = repo.url;
    const existing = ossProjectMap.get(key) || {
      name: repo.name,
      owner: repo.owner.login,
      ownerAvatarUrl: repo.owner.avatarUrl,
      url: repo.url,
      stars: repo.stargazerCount,
      prsCount: 0,
      mergedCount: 0,
      additions: 0,
      deletions: 0,
      language: repo.primaryLanguage?.name ?? null,
      languageColor: repo.primaryLanguage?.color ?? null
    };

    existing.prsCount++;

    if (node.pullRequest.state === 'MERGED') {
      existing.mergedCount++;
      existing.additions += node.pullRequest.additions;
      existing.deletions += node.pullRequest.deletions;
    }

    ossProjectMap.set(key, existing);
  }

  const ossProjectStats = Array.from(ossProjectMap.values())
    .sort((a, b) => b.prsCount - a.prsCount)
    .slice(0, 50); // Limit to top 50 projects to prevent huge payload

  return {
    user: {
      login: viewer.login,
      avatarUrl: viewer.avatarUrl,
      name: viewer.name || viewer.login
    },
    year,
    totalCommitContributions,
    totalPullRequestContributions,
    totalReviewContributions,
    totalIssueContributions,
    contributionsByDay,
    peakDay: peakDayStats,
    commitHoursUTC,
    topLanguages,
    topRepositories: topRepositories.slice(0, 12),
    openSourceStats: {
      totalPrs,
      mergedPrs,
      projectStats: ossProjectStats
    }
  };
}
