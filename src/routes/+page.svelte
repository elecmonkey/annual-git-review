<script lang="ts">
  import Chart from '$lib/components/Chart.svelte';
  import GithubIcon from '$lib/components/GitHubIcon.svelte';
  import SlideStory from '$lib/components/SlideStory.svelte';
  import type { EChartsOption } from 'echarts';
  import type { GithubStats } from '$lib/server/github';
  import { onMount } from 'svelte';
  import {
    Loader2,
    Github,
    Calendar,
    Code,
    GitCommit,
    GitPullRequest,
    MessageSquare,
    Star,
    Settings,
    X,
    Globe,
    GitMerge,
    ExternalLink
  } from 'lucide-svelte';

  // let { form } = $props<{ form: ActionData }>();

  let loading = $state(false);
  let showSettings = $state(false);
  let showStory = $state(false);
  let stats: GithubStats | undefined = $state(undefined);
  let token = $state('');
  let includePrivate = $state(true);
  let ossMinStars = $state(0);
  let ossIncludeOwn = $state(true);

  // Initialize stats and token from localStorage or form data
  onMount(() => {
    const cachedToken = localStorage.getItem('github_token');
    if (cachedToken) {
      token = cachedToken;
    }

    const cachedStats = localStorage.getItem('github_stats');
    if (cachedStats) {
      try {
        stats = JSON.parse(cachedStats);
      } catch (e) {
        console.error('Failed to parse cached stats', e);
      }
    }

    const cachedIncludePrivate = localStorage.getItem('include_private');
    if (cachedIncludePrivate !== null) {
      includePrivate = cachedIncludePrivate === 'true';
    }

    const cachedOssMinStars = localStorage.getItem('oss_min_stars');
    if (cachedOssMinStars) {
      ossMinStars = parseInt(cachedOssMinStars);
    }

    const cachedOssIncludeOwn = localStorage.getItem('oss_include_own');
    if (cachedOssIncludeOwn !== null) {
      ossIncludeOwn = cachedOssIncludeOwn === 'true';
    }
  });

  function getHeatmapOptions(
    data: { date: string; count: number }[],
    year: number
  ): EChartsOption {
    const heatmapData = data.map((item) => [item.date, item.count]);
    const max = Math.max(...data.map((d) => d.count), 5);

    return {
      tooltip: {
        position: 'top',
        formatter: function (p: unknown) {
          const params = p as { data: [string, number] };
          // Simple date formatter instead of importing full echarts
          return params.data[0] + ': ' + params.data[1];
        }
      },
      visualMap: {
        type: 'piecewise', // Switch to piecewise for better control
        min: 0,
        max: max,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 'top',
        pieces: [
          // Range for 0 commits
          { value: 0, color: '#fff', label: '0' },
          // Ranges for > 0 commits (split dynamically based on max)
          { min: 1, max: Math.ceil(max * 0.25), color: '#9be9a8' },
          { min: Math.ceil(max * 0.25) + 1, max: Math.ceil(max * 0.5), color: '#40c463' },
          { min: Math.ceil(max * 0.5) + 1, max: Math.ceil(max * 0.75), color: '#30a14e' },
          { min: Math.ceil(max * 0.75) + 1, max: max, color: '#216e39' }
        ]
      },
      calendar: {
        top: 60,
        left: 30,
        right: 30,
        cellSize: [13, 13], // Square aspect ratio
        range: year,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#f0f0f0' // Light grey border for grid visibility
        },
        yearLabel: { show: false },
        monthLabel: { show: true, nameMap: 'en' }, // Show month labels
        dayLabel: { show: true, nameMap: 'en' }, // Ensure day labels are also shown if needed
        splitLine: { show: false }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: heatmapData
      }
    };
  }

  function getLanguageOptions(
    data: { name: string; count: number; color: string }[]
  ): EChartsOption {
    return {
      tooltip: { trigger: 'item' },
      legend: { top: '0%', left: 'center' }, // Legend moved to top
      series: [
        {
          name: 'Languages',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '55%'], // Slightly higher than 60%
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: data.map((d) => ({ value: d.count, name: d.name, itemStyle: { color: d.color } }))
        }
      ]
    };
  }

  function getRepoOptions(
    data: { name: string; commits: number; languageColor: string | null }[]
  ): EChartsOption {
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
      xAxis: { type: 'value', boundaryGap: [0, 0.01] },
      yAxis: { type: 'category', data: data.map((d) => d.name).reverse() },
      series: [
        {
          name: 'Commits',
          type: 'bar',
          data: data
            .map((d) => ({ value: d.commits, itemStyle: { color: d.languageColor || '#5470c6' } }))
            .reverse()
        }
      ]
    };
  }
</script>

<div class="min-h-screen bg-gray-50 pb-10 font-sans text-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-10 mb-8 border-b border-gray-200 bg-white py-6 shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <Github class="h-8 w-8" />
          <h1 class="text-2xl font-bold tracking-tight">Annual Git Review</h1>
        </div>
        <div class="flex items-center gap-2">
          {#if stats}
            <button
              onclick={() => (showStory = true)}
              class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><path d="m9 16 6-6"/></svg>
              Story Mode
            </button>
          {/if}
          <a
            href="https://github.com/elecmonkey/annual-git-review"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="View on GitHub"
          >
            <GithubIcon class="h-6 w-6" />
          </a>
          <button
            class="rounded-full p-2 transition-colors hover:bg-gray-100"
            onclick={() => (showSettings = true)}
            aria-label="Settings"
          >
            <Settings class="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>

  <main class="mx-auto max-w-6xl px-4">
    {#if !stats}
      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="mb-6 rounded-full bg-white p-6 shadow-sm">
          <Github class="h-16 w-16 text-gray-400" />
        </div>
        <h2 class="mb-2 text-2xl font-bold">No Report Generated Yet</h2>
        <p class="mb-8 max-w-md text-gray-500">
          Enter your GitHub Personal Access Token to generate your annual coding report. Your token
          is never stored on our servers.
        </p>
        <button
          class="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
          onclick={() => (showSettings = true)}
        >
          <Settings class="h-4 w-4" />
          Configure Settings
        </button>
      </div>
    {:else}
      <!-- Report View -->

      <!-- Profile Section -->
      <div
        class="mb-6 flex flex-col items-center gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row"
      >
        <img
          src={stats.user.avatarUrl}
          alt={stats.user.login}
          class="h-24 w-24 rounded-full border-4 border-gray-100"
        />
        <div class="text-center md:text-left">
          <h2 class="text-3xl font-bold">{stats.user.name}</h2>
          <p class="text-lg text-gray-500">@{stats.user.login}</p>
        </div>
        <div class="grow"></div>
        <div class="rounded-lg bg-gray-50 p-4 text-center md:text-right">
          <div class="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            Total Contributions
          </div>
          <div class="text-4xl font-bold text-green-600">
            {stats.totalCommitContributions +
              stats.totalPullRequestContributions +
              stats.totalReviewContributions +
              stats.totalIssueContributions}
          </div>
          <div class="text-sm text-gray-400">in {stats.year}</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div
          class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div class="rounded-lg bg-blue-50 p-3 text-blue-600">
            <GitCommit class="h-6 w-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">{stats.totalCommitContributions}</div>
            <div class="text-sm text-gray-500">Commits</div>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div class="rounded-lg bg-purple-50 p-3 text-purple-600">
            <GitPullRequest class="h-6 w-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">{stats.totalPullRequestContributions}</div>
            <div class="text-sm text-gray-500">Pull Requests</div>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div class="rounded-lg bg-orange-50 p-3 text-orange-600">
            <MessageSquare class="h-6 w-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">{stats.totalReviewContributions}</div>
            <div class="text-sm text-gray-500">Reviews</div>
          </div>
        </div>
        <div
          class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div class="rounded-lg bg-green-50 p-3 text-green-600">
            <Star class="h-6 w-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">{stats.totalIssueContributions}</div>
            <div class="text-sm text-gray-500">Issues</div>
          </div>
        </div>
      </div>

      <!-- Contribution Calendar -->
      <div class="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Calendar class="h-5 w-5 text-gray-500" />
          Contribution Calendar
        </h3>
        <Chart options={getHeatmapOptions(stats.contributionsByDay, stats.year)} height="200px" />
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Top Languages -->
        <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Code class="h-5 w-5 text-gray-500" />
            Top Languages
          </h3>
          <Chart options={getLanguageOptions(stats.topLanguages)} height="400px" />
        </div>

        <!-- Top Repositories -->
        <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Github class="h-5 w-5 text-gray-500" />
            Top Repositories
          </h3>
          <Chart options={getRepoOptions(stats.topRepositories)} height="400px" />
        </div>
      </div>

      <!-- Open Source Stats -->
      {#if stats.openSourceStats && stats.openSourceStats.totalPrs > 0}
        <div class="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Globe class="h-5 w-5 text-gray-500" />
            Open Source Contributions
          </h3>

          <div class="grid gap-4 md:grid-cols-3">
            <!-- Summary Cards -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-blue-50/50 p-4">
                <div class="rounded-lg bg-blue-100 p-3 text-blue-600">
                  <GitPullRequest class="h-6 w-6" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{stats.openSourceStats.totalPrs}</div>
                  <div class="text-sm font-medium text-gray-500">Total PRs</div>
                </div>
              </div>

              <div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-purple-50/50 p-4">
                <div class="rounded-lg bg-purple-100 p-3 text-purple-600">
                  <GitMerge class="h-6 w-6" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{stats.openSourceStats.mergedPrs}</div>
                  <div class="text-sm font-medium text-gray-500">Merged PRs</div>
                </div>
              </div>
            </div>

            <!-- Top Projects List -->
            <div class="rounded-xl border border-gray-100 bg-gray-50 p-4 md:col-span-2">
              <h4 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Top Projects</h4>
              <div class="space-y-3">
                {#each stats.openSourceStats.projectStats.slice(0, 5) as project}
                  <div class="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                    <div class="flex items-center gap-3">
                      <img
                        src={project.ownerAvatarUrl}
                        alt={project.owner}
                        class="h-8 w-8 rounded-full border border-gray-200"
                      />
                      <div>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="flex items-center gap-1 font-medium hover:underline hover:text-blue-600"
                        >
                          {project.owner}/{project.name}
                          <ExternalLink class="h-3 w-3 opacity-50" />
                        </a>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <span class="flex items-center gap-1">
                            <Star class="h-3 w-3" /> {project.stars}
                          </span>
                          {#if project.language}
                            <span class="flex items-center gap-1">
                              <span class="h-2 w-2 rounded-full" style="background-color: {project.languageColor}"></span>
                              {project.language}
                            </span>
                          {/if}
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="flex flex-row gap-1">
                        <div class="text-sm font-bold">{project.prsCount} PRs</div>
                        <div class="text-sm font-bold text-green-600">{project.mergedCount} merged</div>
                      </div>
                      <div class="text-xs font-mono">
                        <span class="text-green-600">+{project.additions}</span>
                        <span class="text-red-600">-{project.deletions}</span>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </main>

  <!-- Settings Modal -->
  {#if showSettings}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        class="animate-in fade-in zoom-in w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl duration-200"
      >
        <div class="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 class="text-lg font-semibold">Settings</h2>
          <button
            onclick={() => (showSettings = false)}
            class="rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <X class="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div class="p-6">
          <form
            onsubmit={async (e) => {
              e.preventDefault();
              loading = true;
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              const tokenValue = formData.get('token')?.toString();
              if (tokenValue) {
                localStorage.setItem('github_token', tokenValue);
              }

              const includePrivateValue = formData.get('includePrivate') === 'on';
              localStorage.setItem('include_private', String(includePrivateValue));

              const ossMinStarsValue = formData.get('ossMinStars')?.toString() || '0';
              localStorage.setItem('oss_min_stars', ossMinStarsValue);

              const ossIncludeOwnValue = formData.get('ossIncludeOwn') === 'on';
              localStorage.setItem('oss_include_own', String(ossIncludeOwnValue));

              try {
                const res = await fetch('/api/generate', {
                  method: 'POST',
                  body: JSON.stringify({
                    token: tokenValue,
                    year: formData.get('year')?.toString(),
                    includePrivate: includePrivateValue,
                    ossMinStars: ossMinStarsValue,
                    ossIncludeOwn: ossIncludeOwnValue
                  }),
                  headers: { 'Content-Type': 'application/json' }
                });
                const result = await res.json();
                if (result.success) {
                  stats = result.stats;
                  showSettings = false;
                  // Cache stats
                  setTimeout(() => {
                    localStorage.setItem('github_stats', JSON.stringify(result.stats));
                  }, 0);
                } else {
                  console.error(result.message);
                  alert(result.message || 'Failed to generate report');
                }
              } catch (err) {
                console.error(err);
                alert('An error occurred while generating the report');
              } finally {
                loading = false;
              }
            }}
            class="space-y-4"
          >
            <div>
              <label for="token" class="block text-sm font-medium text-gray-700 mb-1">GitHub Personal Access Token</label>
              <input
                type="password"
                name="token"
                id="token"
                bind:value={token}
                required
                placeholder="ghp_..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
              <p class="mt-1 text-xs text-gray-500">
                Token requires <code>read:user</code> scope. It is not stored on server.
              </p>
            </div>

            <div>
              <label for="year" class="mb-1 block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                id="year"
                value={new Date().getFullYear()}
                class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-black"
              />
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                name="includePrivate"
                id="includePrivate"
                bind:checked={includePrivate}
                class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label for="includePrivate" class="text-sm font-medium text-gray-700">
                Include private repositories in report
              </label>
            </div>

            <div class="space-y-3 border-t border-gray-100 pt-3">
              <h3 class="text-sm font-semibold text-gray-900">Open Source Settings</h3>

              <div>
                <label for="ossMinStars" class="mb-1 block text-sm font-medium text-gray-700">
                  Min Stars Threshold
                </label>
                <input
                  type="number"
                  name="ossMinStars"
                  id="ossMinStars"
                  bind:value={ossMinStars}
                  min="0"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-black"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Minimum stars for a repo to count as "Open Source" contribution.
                </p>
              </div>

              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="ossIncludeOwn"
                  id="ossIncludeOwn"
                  bind:checked={ossIncludeOwn}
                  class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label for="ossIncludeOwn" class="text-sm font-medium text-gray-700">
                  Include my own repositories
                </label>
              </div>
            </div>

            {#if loading}
              <!-- Loading indicator is handled in button -->
            {/if}

            <div class="pt-2">
              <button
                type="submit"
                disabled={loading}
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {#if loading}
                  <Loader2 class="h-4 w-4 animate-spin" />
                  Generating...
                {:else}
                  Generate Report
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}

  {#if showStory && stats}
    <SlideStory {stats} onClose={() => (showStory = false)} />
  {/if}
</div>
