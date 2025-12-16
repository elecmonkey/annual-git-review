<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import { settings } from '$lib/settings.svelte';
  import * as m from '$lib/paraglide/messages';

  let { stats } = $props<{ stats: GithubStats }>();

  function getLevelColor(level: string) {
    switch (level) {
      case 'FOURTH_QUARTILE':
        return theme.current.contributionColors.q4;
      case 'THIRD_QUARTILE':
        return theme.current.contributionColors.q3;
      case 'SECOND_QUARTILE':
        return theme.current.contributionColors.q2;
      case 'FIRST_QUARTILE':
        return theme.current.contributionColors.q1;
      default:
        return 'bg-white/10';
    }
  }

  // Calculate padding for correct day alignment (GitHub graph starts on Sunday)
  let contributionData = $derived.by(() => {
    if (!stats.contributionsByDay.length) return [];

    const firstDay = new Date(stats.contributionsByDay[0].date);
    const dayOfWeek = firstDay.getUTCDay(); // 0 = Sunday (Use UTC to avoid timezone shifts)

    // Create padding array for the start
    const startPadding = Array(dayOfWeek).fill(null);

    return [...startPadding, ...stats.contributionsByDay];
  });
</script>

<div class="space-y-6">
  <img
    src={stats.user.avatarUrl}
    alt="Avatar"
    class="mx-auto h-32 w-32 rounded-full border-4 shadow-lg {theme.current.border}"
  />
  <div>
    <h2 class="mb-2 text-3xl font-bold">{m.intro_hi({ name: stats.user.login })}</h2>
    <p class="text-lg {theme.current.textSecondary}">{m.intro_journey({ year: stats.year })}</p>
  </div>
  <div class="{theme.current.accentGradient} bg-clip-text text-5xl font-black text-transparent">
    {stats.totalCommitContributions +
      stats.totalPullRequestContributions +
      stats.totalReviewContributions +
      stats.totalIssueContributions}
  </div>
  <p class="text-sm tracking-widest {theme.current.textMuted} uppercase">
    {m.intro_total_contributions()}
  </p>
</div>

{#if settings.showGreenWall}
  <div class="mt-8 w-[110%] px-4">
    <div
      class="grid w-full grid-flow-col grid-rows-7 gap-px"
      style="grid-template-columns: repeat(53, minmax(0, 1fr));"
    >
      {#each contributionData as day}
        {#if day}
          <div
            class="aspect-square w-full rounded-[1px] {getLevelColor(day.level)}"
            title="{day.date}: {day.count} contributions"
          ></div>
        {:else}
          <div class="aspect-square w-full bg-transparent"></div>
        {/if}
      {/each}
    </div>
  </div>
{/if}
