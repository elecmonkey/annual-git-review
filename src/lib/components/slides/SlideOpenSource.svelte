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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-8 w-8 {theme.current.textPrimary}"
    viewBox="0 0 1024 991"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M692 991L583 690q54-21 87.5-69.5T704 512q0-80-56-136t-136-56t-136 56t-56 136q0 60 33.5 108.5T441 690L332 991Q185 935 92.5 804.5T0 512q0-104 40.5-199t109-163.5T313 40.5T512 0t199 40.5t163.5 109t109 163.5t40.5 199q0 162-92.5 292.5T692 991"
    />
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
    {#each topOSS as project (project.url)}
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
