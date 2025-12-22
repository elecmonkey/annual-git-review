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

interface RepoSearchResponse {
  search: {
    repositoryCount: number;
  };
}

interface RepositoryNode {
  name: string;
  url: string;
  owner: {
    login: string;
  };
  isPrivate: boolean;
  isFork: boolean;
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
  followers: { totalCount: number };
  following: { totalCount: number };
  issueComments: { totalCount: number };
  contributionsCollection: ContributionsCollection;
}

interface GitHubQueryResponse {
  viewer: Viewer;
}

interface RepoSearchResponse {
  search: {
    repositoryCount: number;
  };
}

interface ForkRepositoryNode {
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

interface ForkRepositoriesResponse {
  viewer: {
    repositories: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: ForkRepositoryNode[];
    };
  };
}

interface CommitHistory {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: { committedDate: string; oid?: string }[];
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

interface BranchRefsResponse {
  repository?: {
    refs?: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: {
        name: string;
      }[];
    };
  };
}

interface BranchHistoryResponse {
  repository?: {
    ref?: {
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
    followers: number;
    following: number;
  };
  year: number;
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalReviewContributions: number;
  totalIssueContributions: number;
  reposCreatedThisYear: number;
  issueCommentsCount: number;
  reviewCommentsCount: number;
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
  ossIncludeOwn = true,
  includeForkRepos = false
): Promise<GithubStats> {
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const queryBody = `
      viewer {
        id
        login
        name
        avatarUrl
        followers {
          totalCount
        }
        following {
          totalCount
        }
        issueComments(last: 1) {
          totalCount
        }
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
              isFork
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
  const issueCommentsCount = viewer.issueComments.totalCount;
  const reviewCommentsCount = collection.totalPullRequestReviewContributions;
  let reposCreatedThisYear = 0;

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

  // Count repositories created in the given year for this user
  try {
    const searchQuery = `user:${viewer.login} fork:true created:${year}-01-01..${year}-12-31`;
    const repoSearchQuery = `
      query($query: String!) {
        search(query: $query, type: REPOSITORY, first: 1) {
          repositoryCount
        }
      }
    `;
    const repoSearchData = await fetchGraphQL<RepoSearchResponse>(token, repoSearchQuery, {
      query: searchQuery
    });
    reposCreatedThisYear = repoSearchData.search.repositoryCount ?? 0;
  } catch (e) {
    console.error('Failed to fetch repos created this year', e);
  }

  // Query fork repositories and count their commits (only if includeForkRepos is true)
  const forkReposMap = new Map<
    string,
    {
      name: string;
      owner: string;
      commits: number;
      language: string | null;
      languageColor: string | null;
      isPrivate: boolean;
      url: string;
    }
  >();

  if (includeForkRepos) {
    try {
      // console.log(`Starting fork repositories query for year ${year}...`);
      const forkReposQuery = `
        query($after: String) {
          viewer {
            repositories(
              first: 100
              after: $after
              isFork: true
              affiliations: [OWNER]
              orderBy: {field: UPDATED_AT, direction: DESC}
            ) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
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
            }
          }
        }
      `;

      let forkAfter: string | undefined = undefined;
      let totalForkReposFound = 0;
      while (true) {
        const forkData: ForkRepositoriesResponse = await fetchGraphQL<ForkRepositoriesResponse>(
          token,
          forkReposQuery,
          {
            after: forkAfter
          }
        );

        const forkRepos = forkData.viewer.repositories.nodes;
        totalForkReposFound += forkRepos.length;
        // console.log(`Found ${forkRepos.length} fork repositories owned by ${viewer.login} in this batch (total: ${totalForkReposFound})`);
        
        // Query to get all branches of a repo
        const branchRefsQuery = `
          query($owner: String!, $name: String!, $after: String) {
            repository(owner: $owner, name: $name) {
              refs(refPrefix: "refs/heads/", first: 100, after: $after) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  name
                }
              }
            }
          }
        `;

        // Query to get commits on a specific branch
        const branchHistoryQuery = `
          query($owner: String!, $name: String!, $branch: String!, $authorId: ID!, $from: GitTimestamp!, $to: GitTimestamp!, $after: String) {
            repository(owner: $owner, name: $name) {
              ref(qualifiedName: $branch) {
                target {
                  ... on Commit {
                    history(first: 100, author: {id: $authorId}, since: $from, until: $to, after: $after) {
                      pageInfo { hasNextPage endCursor }
                      nodes { 
                        oid
                        committedDate 
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        for (const forkRepo of forkRepos) {
          // Skip private repos if includePrivate is false
          if (!includePrivate && forkRepo.isPrivate) {
            // console.log(`Skipping private fork repo ${forkRepo.owner.login}/${forkRepo.name}`);
            continue;
          }

          const owner = forkRepo.owner.login;
          const name = forkRepo.name;
          
          // console.log(`Checking fork repo ${owner}/${name} for commits in ${year} (all branches)...`);

          // Set to deduplicate commits by OID (same commit can exist on multiple branches)
          const uniqueCommitOids = new Set<string>();
          const commitDates: string[] = [];

          try {
            // Step 1: Get all branches
            const branches: string[] = [];
            let branchAfter: string | undefined = undefined;
            
            while (true) {
              const branchData: BranchRefsResponse = await fetchGraphQL<BranchRefsResponse>(
                token,
                branchRefsQuery,
                {
                  owner,
                  name,
                  after: branchAfter
                }
              );

              const refs = branchData.repository?.refs;
              if (!refs || refs.nodes.length === 0) break;

              for (const ref of refs.nodes) {
                branches.push(ref.name);
              }

              if (refs.pageInfo.hasNextPage && refs.pageInfo.endCursor) {
                branchAfter = refs.pageInfo.endCursor;
              } else {
                break;
              }
            }

            if (branches.length === 0) {
              // console.log(`  -> No branches found for ${owner}/${name}`);
              continue;
            }

            // Find default branch name (usually main or master)
            const defaultBranches = ['main', 'master'];
            const defaultBranch = branches.find(b => defaultBranches.includes(b));
            
            // Step 2: First, collect commits from default branch to exclude them
            // These are likely synced from upstream (squash merged PRs)
            const defaultBranchCommits = new Set<string>();
            
            if (defaultBranch) {
              // console.log(`  -> Found ${branches.length} branches (default: ${defaultBranch}), scanning...`);
              let histAfter: string | undefined = undefined;
              
              while (true) {
                const histData = await fetchGraphQL<BranchHistoryResponse>(token, branchHistoryQuery, {
                  owner,
                  name,
                  branch: `refs/heads/${defaultBranch}`,
                  authorId,
                  from,
                  to,
                  after: histAfter
                });

                const ref = histData.repository?.ref;
                const target = ref?.target as { history?: CommitHistory } | undefined;
                const history = target?.history ?? null;
                if (!history || history.nodes.length === 0) break;

                for (const node of history.nodes) {
                  if (node.oid) {
                    defaultBranchCommits.add(node.oid);
                  }
                }

                if (history.pageInfo.hasNextPage && history.pageInfo.endCursor) {
                  histAfter = history.pageInfo.endCursor || undefined;
                } else {
                  break;
                }
              }
              
              if (defaultBranchCommits.size > 0) {
                // console.log(`     [${defaultBranch}] Found ${defaultBranchCommits.size} commits (excluded - likely synced from upstream)`);
              }
            } else {
              // console.log(`  -> Found ${branches.length} branches (no default branch found), scanning...`);
            }

            // Step 3: Query commits on feature branches (excluding default branch commits)
            for (const branch of branches) {
              // Skip default branch - already processed
              if (defaultBranches.includes(branch)) continue;
              
              let histAfter: string | undefined = undefined;
              let branchCommitCount = 0;
              let newCommitsOnBranch = 0;
              let excludedFromDefault = 0;
              
              while (true) {
                const histData = await fetchGraphQL<BranchHistoryResponse>(token, branchHistoryQuery, {
                  owner,
                  name,
                  branch: `refs/heads/${branch}`,
                  authorId,
                  from,
                  to,
                  after: histAfter
                });

                const ref = histData.repository?.ref;
                const target = ref?.target as { history?: CommitHistory } | undefined;
                const history = target?.history ?? null;
                if (!history || history.nodes.length === 0) break;

                branchCommitCount += history.nodes.length;

                for (const node of history.nodes) {
                  if (!node.oid) continue;
                  
                  // Skip commits that exist on default branch (synced from upstream)
                  if (defaultBranchCommits.has(node.oid)) {
                    excludedFromDefault++;
                    continue;
                  }
                  
                  // Deduplicate by commit OID
                  if (!uniqueCommitOids.has(node.oid)) {
                    uniqueCommitOids.add(node.oid);
                    commitDates.push(node.committedDate);
                    newCommitsOnBranch++;
                    // Log each unique commit found
                    // console.log(`     [${branch}] Found commit ${shortOid} (${new Date(node.committedDate).toISOString().split('T')[0]})`);
                  }
                }

                if (history.pageInfo.hasNextPage && history.pageInfo.endCursor) {
                  histAfter = history.pageInfo.endCursor || undefined;
                } else {
                  break;
                }
              }

              if (branchCommitCount > 0) {
                const deduped = branchCommitCount - newCommitsOnBranch - excludedFromDefault;
                if (excludedFromDefault > 0 || deduped > 0) {
                  // console.log(`     [${branch}] ${branchCommitCount} total, ${excludedFromDefault} from default branch excluded, ${deduped} deduped`);
                }
              }
            }

            // Count commit hours from unique commits
            // Avoid double-counting: if this fork repo is already represented
            // in commitContributionsByRepository, its commit hours will be
            // accounted for there.
            if (!commitContributionsByRepository.has(forkRepo.url)) {
              for (const dateStr of commitDates) {
                const d = new Date(dateStr);
                const h = d.getUTCHours();
                commitHoursUTC[h]++;
              }
            }

            const commitCount = uniqueCommitOids.size;
            if (commitCount > 0) {
              forkReposMap.set(forkRepo.url, {
                name: forkRepo.name,
                owner: forkRepo.owner.login,
                commits: commitCount,
                language: forkRepo.primaryLanguage?.name ?? null,
                languageColor: forkRepo.primaryLanguage?.color ?? null,
                isPrivate: forkRepo.isPrivate,
                url: forkRepo.url
              });
              // console.log(`  -> Added with ${commitCount} unique commits across ${branches.length} branches`);
            } else {
              // console.log(`  -> No commits by you in ${year} on any branch`);
            }
          } catch (err) {
            console.warn(`Failed to fetch commits for fork repo ${owner}/${name}:`, err);
          }
        }

        if (forkData.viewer.repositories.pageInfo.hasNextPage && forkData.viewer.repositories.pageInfo.endCursor) {
          forkAfter = forkData.viewer.repositories.pageInfo.endCursor;
        } else {
          break;
        }
      }
      // console.log(`Fork repositories query complete. Found ${forkReposMap.size} fork repos with commits.`);
  } catch (e) {
      console.error('Failed to fetch fork repositories', e);
    }
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
    }));

  // Merge fork repositories into topRepositories
  let newForkCommitsTotal = 0;
  for (const forkRepo of forkReposMap.values()) {
    const existingIndex = topRepositories.findIndex(
      (repo) => repo.name === forkRepo.name && repo.owner === forkRepo.owner
    );
    if (existingIndex >= 0) {
      // If fork repo already exists (from commitContributionsByRepository), add commits
      // Note: Only count commits that weren't already counted by GitHub API
      // GitHub API only counts commits merged via PR, so we add the fork's direct commits
      topRepositories[existingIndex].commits += forkRepo.commits;
      newForkCommitsTotal += forkRepo.commits;
    } else {
      // Add new fork repo (not in commitContributionsByRepository)
      topRepositories.push(forkRepo);
      newForkCommitsTotal += forkRepo.commits;
    }
  }

  // Sort by commit count
  topRepositories.sort((a, b) => b.commits - a.commits);

  if (!includePrivate) {
    topRepositories = topRepositories.filter((repo) => !repo.isPrivate);
  }

  // Update totalCommitContributions to include fork repos
  // Only add commits from fork repos that weren't already counted
  totalCommitContributions += newForkCommitsTotal;

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
      name: viewer.name || viewer.login,
      followers: viewer.followers.totalCount,
      following: viewer.following.totalCount
    },
    year,
    totalCommitContributions,
    totalPullRequestContributions,
    totalReviewContributions,
    totalIssueContributions,
    issueCommentsCount,
    reviewCommentsCount,
    reposCreatedThisYear,
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
