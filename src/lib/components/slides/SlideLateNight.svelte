<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';
  import { Star } from 'lucide-svelte';

  let { stats } = $props<{ stats: GithubStats }>();

  function calculateLateNightCommits() {
    if (!stats.commitHoursUTC || stats.commitHoursUTC.length === 0) return 0;

    const offsetMinutes = -new Date().getTimezoneOffset();
    let lateNightSampled = 0;
    let totalSampled = 0;

    stats.commitHoursUTC.forEach((count: number, utcHour: number) => {
      totalSampled += count;
      let localMinutes = (utcHour * 60 + offsetMinutes) % (24 * 60);
      if (localMinutes < 0) localMinutes += 24 * 60;
      const localHour = Math.floor(localMinutes / 60);

      if (localHour === 23 || localHour < 6) {
        lateNightSampled += count;
      }
    });

    if (totalSampled === 0) return 0;

    return lateNightSampled;
  }

  let lateNightCount = calculateLateNightCommits();
</script>

<div class="space-y-8">
  <div class="flex items-center gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-400 dark:text-amber-300" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12.075 22q-2.1 0-3.937-.8t-3.2-2.162t-2.163-3.2t-.8-3.938q0-3.1 1.713-5.625t4.587-3.7q.35-.125.725-.088t.625.238q.2.175.313.488t.112.812q.05 1.975.8 3.763T13 10.975t3.2 2.15t3.775.8q.525 0 .8.088t.45.287q.2.25.263.65t-.063.725q-1.15 2.875-3.7 4.6T12.075 22M14.3 7.3l-1.6-1.6q-.3-.3-.3-.7t.3-.7l1.6-1.6q.3-.3.7-.3t.7.3l1.6 1.6q.3.3.3.7t-.3.7l-1.6 1.6q-.3.3-.7.3t-.7-.3m5 3l-.6-.6q-.3-.3-.3-.7t.3-.7l.6-.6q.3-.3.7-.3t.7.3l.6.6q.3.3.3.7t-.3.7l-.6.6q-.3.3-.7.3t-.7-.3"/>
    </svg>
    <h2 class="text-4xl font-black italic {theme.current.textPrimary}">
      {m.slide_late_night_title()}
    </h2>
  </div>

  <div class="flex flex-col items-center text-center space-y-6">
    <div class="relative">
      <div class="absolute -inset-4 rounded-full bg-amber-400/20 dark:bg-amber-300/20 blur-xl animate-pulse"></div>
      <span class="relative text-8xl font-black text-amber-400 dark:text-amber-300 tabular-nums tracking-tight">
        {lateNightCount}
      </span>
    </div>

    <p class="text-xl font-medium leading-relaxed {theme.current.textSecondary} max-w-md">
      {m.slide_late_night_desc({ count: lateNightCount })}
    </p>

    {#if lateNightCount > 0}
      <div class="flex gap-2 mt-4">
        {#each Array(Math.min(5, Math.ceil(lateNightCount / 10))) as _}
          <Star class="h-5 w-5 text-amber-400 fill-amber-400 animate-bounce" style="animation-delay: {Math.random()}s" />
        {/each}
      </div>
    {/if}
  </div>
</div>
