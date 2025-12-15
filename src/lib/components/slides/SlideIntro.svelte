<script lang="ts">
  import type { GithubStats } from '$lib/server/github';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<div class="space-y-6">
  <img
    src={stats.user.avatarUrl}
    alt="Avatar"
    class="mx-auto h-32 w-32 rounded-full border-4 border-white/20 shadow-lg"
  />
  <div>
    <h2 class="mb-2 text-3xl font-bold">Hi, @{stats.user.login}</h2>
    <p class="text-lg text-white/80">Your {stats.year} GitHub Journey</p>
  </div>
  <div
    class="bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-5xl font-black text-transparent"
  >
    {stats.totalCommitContributions +
      stats.totalPullRequestContributions +
      stats.totalReviewContributions +
      stats.totalIssueContributions}
  </div>
  <p class="text-sm tracking-widest text-white/60 uppercase">Total Contributions</p>
</div>
