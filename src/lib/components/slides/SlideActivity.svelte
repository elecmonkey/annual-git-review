<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<h3 class="mb-6 text-2xl font-bold {theme.current.textPrimary}">Activity Peak</h3>

<div class="space-y-6">
  <!-- Peak Day Card -->
  <div class="rounded-2xl {theme.current.cardBg} p-8 backdrop-blur-md border {theme.current.border}">
    <div class="flex items-baseline gap-3">
       <span class="text-7xl font-black {theme.current.accentGradient} bg-clip-text text-transparent">
         {stats.peakDay.count}
       </span>
       <span class="text-xl font-medium {theme.current.textMuted}">contributions</span>
    </div>

    <div class="mt-4 text-2xl font-medium {theme.current.textSecondary}">
      {new Date(stats.peakDay.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
      <span class="ml-2 opacity-60 text-lg font-normal">
        {new Date(stats.peakDay.date).toLocaleDateString(undefined, { weekday: 'long' })}
      </span>
    </div>

    {#if stats.peakDay.topRepo}
      <div class="mt-6 pt-6 border-t {theme.current.border}">
        <div class="flex items-center gap-2 {theme.current.textMuted} text-sm mb-2">
          <span>Most active in</span>
        </div>
        <p class="font-bold {theme.current.accentText} text-2xl truncate mb-3">
          {stats.peakDay.topRepo}
        </p>
        <p class="{theme.current.textSecondary} text-base italic opacity-80">
          Does this repository hold a special place in your memory?
        </p>
      </div>
    {/if}
  </div>
</div>
