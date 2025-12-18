<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { GitPullRequest, GitMerge, Star } from 'lucide-svelte';
  import { theme } from '$lib/theme.svelte';
  import { settings } from '$lib/settings.svelte';
  import * as m from '$lib/paraglide/messages';

  let { stats } = $props<{ stats: GithubStats }>();

  let topOSS = $derived(stats.openSourceStats.projectStats.slice(0, settings.ossCount));
</script>

<div class="mb-6 flex items-center gap-3 text-left">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 {theme.current.textPrimary}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001 2c5.523 0 10 4.477 10 10c0 4.13-2.504 7.676-6.077 9.201l-2.518-6.55A3 3 0 0 0 12 9a3 3 0 0 0-1.404 5.652l-2.518 6.55A10 10 0 0 1 2 12C2 6.477 6.477 2 12 2"/>
  </svg>
  <h3 class="text-2xl font-bold">{m.oss_title()}</h3>
</div>

<div class="mb-8 grid w-full grid-cols-2 gap-4">
  <div class="rounded-xl {theme.current.cardBg} p-4 backdrop-blur-md">
    <div class="mb-1 flex items-center justify-center gap-2 {theme.current.textSecondary}">
      <GitPullRequest size={20} />
      <span class="text-sm font-medium tracking-wider uppercase">Total PRs</span>
    </div>
    <div class="text-3xl font-black">{stats.openSourceStats.totalPrs}</div>
  </div>
  <div class="rounded-xl {theme.current.cardBg} p-4 backdrop-blur-md">
    <div class="mb-1 flex items-center justify-center gap-2 {theme.current.accentText}">
      <GitMerge size={20} />
      <span class="text-sm font-medium tracking-wider uppercase">Merged</span>
    </div>
    <div class="text-3xl font-black">{stats.openSourceStats.mergedPrs}</div>
  </div>
</div>

<div class="w-full space-y-4 text-left">
  {#if topOSS.length > 0}
    {#each topOSS as project}
      <div
        class="flex items-center gap-4 rounded-xl border {theme.current.border} {theme.current
          .cardBg} p-4 backdrop-blur-sm"
      >
        <img
          src={project.ownerAvatarUrl}
          alt={project.owner}
          class="h-10 w-10 rounded-full border {theme.current.border}"
        />
        <div class="min-w-0 flex-1">
          <div class="truncate font-bold">{project.owner}/{project.name}</div>
          <div class="flex items-center gap-3 text-xs opacity-60">
            <span class="flex items-center gap-1">
              <Star size={10} />
              {project.stars}
            </span>
            {#if project.language}
              <span class="flex items-center gap-1">
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  style="background-color: {project.languageColor}"
                ></span>
                {project.language}
              </span>
            {/if}
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-green-400">+{project.additions}</div>
          <div class="text-xs text-red-400">-{project.deletions}</div>
        </div>
      </div>
    {/each}
  {:else}
    <div
      class="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed {theme
        .current.border} {theme.current.cardBg} p-6 text-center {theme.current.textMuted}"
    >
      <p>No public PRs found this year.</p>
      <p class="text-sm">Time to start your OSS journey!</p>
    </div>
  {/if}
</div>

{#if topOSS.length > 0}
  <div class="mt-6 text-center text-sm italic {theme.current.textMuted}">
    "Thank you for contributing to the open source world."
  </div>
{/if}
