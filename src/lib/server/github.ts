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
        repository: {
          name: string;
          url: string;
          stargazerCount: number;
          isPrivate: boolean;
          owner: {
            login: string;
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
  login: string;
  name: string | null;
  avatarUrl: string;
  contributionsCollection: ContributionsCollection;
}

interface GitHubQueryResponse {
  viewer: Viewer;
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
      url: string;
      stars: number;
      prsCount: number;
      mergedCount: number;
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

  const query = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
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
            contributions {
              totalCount
            }
          }

          pullRequestContributions(first: 100, orderBy: {direction: DESC}) {
            nodes {
              pullRequest {
                title
                state
                repository {
                  name
                  url
                  stargazerCount
                  isPrivate
                  owner {
                    login
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
    }
  `;

  const data = await fetchGraphQL<GitHubQueryResponse>(token, query, { from, to });
  const viewer = data.viewer;
  const collection = viewer.contributionsCollection;

  // Process Contributions by Day
  const contributionsByDay: GithubStats['contributionsByDay'] = [];
  for (const week of collection.contributionCalendar.weeks) {
    for (const day of week.contributionDays) {
      contributionsByDay.push({
        date: day.date,
        count: day.contributionCount,
        level: day.contributionLevel
      });
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
      url: string;
      stars: number;
      prsCount: number;
      mergedCount: number;
      language: string | null;
      languageColor: string | null;
    }
  >();

  let totalPrs = 0;
  let mergedPrs = 0;

  for (const node of prNodes) {
    const repo = node.pullRequest.repository;

    // Filter: Must be public
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
      url: repo.url,
      stars: repo.stargazerCount,
      prsCount: 0,
      mergedCount: 0,
      language: repo.primaryLanguage?.name ?? null,
      languageColor: repo.primaryLanguage?.color ?? null
    };

    existing.prsCount++;
    if (node.pullRequest.state === 'MERGED') {
      existing.mergedCount++;
    }

    ossProjectMap.set(key, existing);
  }

  const ossProjectStats = Array.from(ossProjectMap.values()).sort(
    (a, b) => b.prsCount - a.prsCount
  );

  return {
    user: {
      login: viewer.login,
      name: viewer.name || viewer.login,
      avatarUrl: viewer.avatarUrl
    },
    year,
    totalCommitContributions: collection.totalCommitContributions,
    totalPullRequestContributions: collection.totalPullRequestContributions,
    totalReviewContributions: collection.totalPullRequestReviewContributions,
    totalIssueContributions: collection.totalIssueContributions,
    contributionsByDay,
    topLanguages,
    topRepositories: topRepositories.slice(0, 10), // Top 10
    openSourceStats: {
      totalPrs,
      mergedPrs,
      projectStats: ossProjectStats
    }
  };
}
