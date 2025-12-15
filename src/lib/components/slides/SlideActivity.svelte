<script lang="ts">
  import type { GithubStats } from '$lib/server/github';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<h3 class="mb-8 text-2xl font-bold">Activity Peak</h3>
<div class="w-full space-y-8">
  <div class="rounded-xl bg-white/10 p-6 backdrop-blur-md">
    <div class="mb-2 text-4xl font-bold text-green-400">
      {Math.max(...stats.contributionsByDay.map((d: { count: number }) => d.count))}
    </div>
    <div class="text-sm opacity-70">Most contributions in a day</div>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div class="rounded-xl bg-white/10 p-4">
      <div class="text-xl font-bold">{stats.totalCommitContributions}</div>
      <div class="text-xs opacity-60">Commits</div>
    </div>
    <div class="rounded-xl bg-white/10 p-4">
      <div class="text-xl font-bold">{stats.totalPullRequestContributions}</div>
      <div class="text-xs opacity-60">PRs</div>
    </div>
  </div>
</div>
