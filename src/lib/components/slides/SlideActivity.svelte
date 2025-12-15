<script lang="ts">
  import type { GithubStats } from '$lib/server/github';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<h3 class="mb-8 text-2xl font-bold">Activity Peak</h3>
<div class="w-full space-y-8">
  <div class="rounded-xl bg-white/10 p-6 backdrop-blur-md">
    <div class="mb-2 text-4xl font-bold text-green-400">
      {stats.peakDay.count}
    </div>
    <div class="text-sm opacity-70">
      Most contributions on {new Date(stats.peakDay.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })}
    </div>
    {#if stats.peakDay.topRepo}
      <div class="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/80">
        That day, you were likely busy with <span class="font-bold text-green-300"
          >{stats.peakDay.topRepo}</span
        >.<br />
        "Code is poetry, written for machines to execute and humans to understand."
      </div>
    {/if}
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
