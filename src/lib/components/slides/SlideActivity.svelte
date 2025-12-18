<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';
  import { getLanguage } from '$lib/i18n.svelte';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<div class="mb-6 flex items-center gap-3 text-left">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-7 w-7 {theme.current.textPrimary}"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      d="m7.025 11.825l.825-1.7q.25-.525.738-.825T9.65 9H11V2h7l-1 2l1 2h-5v3h1.275q.575 0 1.038.3t.737.8l.875 1.75l-3 2L12 12.875l-1.925.975zM2 22l4.125-8.375l3.8 2.525L12 15.125l2.075 1.025l3.75-2.475L22 22z"
    />
  </svg>
  <h3 class="text-2xl font-bold {theme.current.textPrimary}">{m.activity_peak_title()}</h3>
</div>

<div class="space-y-6">
  <!-- Peak Day Card -->
  <div
    class="rounded-2xl {theme.current.cardBg} border p-8 backdrop-blur-md {theme.current.border}"
  >
    <div class="flex items-baseline justify-center gap-3">
      <span
        class="text-7xl font-black {theme.current.accentGradient} bg-clip-text text-transparent"
      >
        {stats.peakDay.count}
      </span>
      <span class="text-xl font-medium {theme.current.textMuted}"
        >{m.activity_peak_contributions()}</span
      >
    </div>

    <div class="mt-4 text-center text-2xl font-medium {theme.current.textSecondary}">
      {new Date(stats.peakDay.date).toLocaleDateString(getLanguage(), {
        month: 'long',
        day: 'numeric'
      })}
      <span class="ml-2 text-lg font-normal opacity-60">
        {new Date(stats.peakDay.date).toLocaleDateString(getLanguage(), { weekday: 'long' })}
      </span>
    </div>

    {#if stats.peakDay.topRepo}
      <div class="mt-6 border-t pt-6 {theme.current.border}">
        <div class="flex items-center gap-2 {theme.current.textMuted} mb-2 text-sm">
          <span>{m.activity_peak_most_active_in()}</span>
        </div>
        <p class="font-bold {theme.current.accentText} mb-3 truncate text-2xl">
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
    <div class="rounded-xl {theme.current.cardBg} border p-5 {theme.current.border}">
      <div class="text-3xl font-bold {theme.current.textPrimary}">
        {stats.totalCommitContributions}
      </div>
      <div class="text-sm {theme.current.textMuted} mt-1">Commits</div>
    </div>
    <div class="rounded-xl {theme.current.cardBg} border p-5 {theme.current.border}">
      <div class="text-3xl font-bold {theme.current.textPrimary}">
        {stats.totalPullRequestContributions}
      </div>
      <div class="text-sm {theme.current.textMuted} mt-1">Pull Requests</div>
    </div>
  </div>
</div>
