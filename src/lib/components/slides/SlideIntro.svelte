<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<div class="space-y-6">
  <img
    src={stats.user.avatarUrl}
    alt="Avatar"
    class="mx-auto h-32 w-32 rounded-full border-4 shadow-lg {theme.current.border}"
  />
  <div>
    <h2 class="mb-2 text-3xl font-bold">Hi, @{stats.user.login}</h2>
    <p class="text-lg {theme.current.textSecondary}">Your {stats.year} GitHub Journey</p>
  </div>
  <div
    class="{theme.current.accentGradient} bg-clip-text text-5xl font-black text-transparent"
  >
    {stats.totalCommitContributions +
      stats.totalPullRequestContributions +
      stats.totalReviewContributions +
      stats.totalIssueContributions}
  </div>
  <p class="text-sm tracking-widest {theme.current.textMuted} uppercase">Total Contributions</p>
</div>
