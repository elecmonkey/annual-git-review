<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { GitPullRequest, GitMerge, Star } from 'lucide-svelte';
  import { theme } from '$lib/theme.svelte';

  let { stats } = $props<{ stats: GithubStats }>();

  let topOSS = $derived(stats.openSourceStats.projectStats.slice(0, 3));
</script>

<h3 class="mb-6 text-2xl font-bold">Open Source Impact</h3>

<div class="mb-8 grid grid-cols-2 gap-4 w-full">
  <div class="rounded-xl {theme.current.cardBg} p-4 backdrop-blur-md">
    <div class="mb-1 flex items-center justify-center gap-2 {theme.current.textSecondary}">
      <GitPullRequest size={20} />
      <span class="text-sm font-medium uppercase tracking-wider">Total PRs</span>
    </div>
    <div class="text-3xl font-black">{stats.openSourceStats.totalPrs}</div>
  </div>
  <div class="rounded-xl {theme.current.cardBg} p-4 backdrop-blur-md">
    <div class="mb-1 flex items-center justify-center gap-2 {theme.current.accentText}">
      <GitMerge size={20} />
      <span class="text-sm font-medium uppercase tracking-wider">Merged</span>
    </div>
    <div class="text-3xl font-black">{stats.openSourceStats.mergedPrs}</div>
  </div>
</div>

<div class="w-full space-y-4 text-left">
  {#if topOSS.length > 0}
    {#each topOSS as project}
      <div class="flex items-center gap-4 rounded-xl border {theme.current.border} {theme.current.cardBg} p-4 backdrop-blur-sm">
        <img
          src={project.ownerAvatarUrl}
          alt={project.owner}
          class="h-10 w-10 rounded-full border {theme.current.border}"
        />
        <div class="min-w-0 flex-1">
          <div class="truncate font-bold">{project.owner}/{project.name}</div>
          <div class="flex items-center gap-3 text-xs opacity-60">
             <span class="flex items-center gap-1">
               <Star size={10} /> {project.stars}
             </span>
             {#if project.language}
               <span class="flex items-center gap-1">
                 <span class="h-1.5 w-1.5 rounded-full" style="background-color: {project.languageColor}"></span>
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
    <div class="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed {theme.current.border} {theme.current.cardBg} p-6 text-center {theme.current.textMuted}">
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
