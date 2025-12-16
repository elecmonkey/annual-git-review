<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';
  import { getLanguage } from '$lib/i18n.svelte';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<h3 class="mb-6 text-2xl font-bold {theme.current.textPrimary}">{m.activity_peak_title()}</h3>

<div class="space-y-6">
  <!-- Peak Day Card -->
  <div class="rounded-2xl {theme.current.cardBg} p-8 backdrop-blur-md border {theme.current.border}">
    <div class="flex items-baseline gap-3">
       <span class="text-7xl font-black {theme.current.accentGradient} bg-clip-text text-transparent">
         {stats.peakDay.count}
       </span>
       <span class="text-xl font-medium {theme.current.textMuted}">{m.activity_peak_contributions()}</span>
    </div>

    <div class="mt-4 text-2xl font-medium {theme.current.textSecondary}">
      {new Date(stats.peakDay.date).toLocaleDateString(getLanguage(), { month: 'long', day: 'numeric' })}
      <span class="ml-2 opacity-60 text-lg font-normal">
        {new Date(stats.peakDay.date).toLocaleDateString(getLanguage(), { weekday: 'long' })}
      </span>
    </div>

    {#if stats.peakDay.topRepo}
      <div class="mt-6 pt-6 border-t {theme.current.border}">
        <div class="flex items-center gap-2 {theme.current.textMuted} text-sm mb-2">
          <span>{m.activity_peak_most_active_in()}</span>
        </div>
        <p class="font-bold {theme.current.accentText} text-2xl truncate mb-3">
          {stats.peakDay.topRepo}
        </p>
        <p class="{theme.current.textSecondary} text-base italic opacity-80">
          {m.activity_peak_question()}
        </p>
      </div>
    {/if}
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 gap-4">
    <div class="rounded-xl {theme.current.cardBg} p-5 border {theme.current.border}">
      <div class="text-3xl font-bold {theme.current.textPrimary}">{stats.totalCommitContributions}</div>
      <div class="text-sm {theme.current.textMuted} mt-1">Commits</div>
    </div>
    <div class="rounded-xl {theme.current.cardBg} p-5 border {theme.current.border}">
      <div class="text-3xl font-bold {theme.current.textPrimary}">{stats.totalPullRequestContributions}</div>
      <div class="text-sm {theme.current.textMuted} mt-1">Pull Requests</div>
    </div>
  </div>
</div>
