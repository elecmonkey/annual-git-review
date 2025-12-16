<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<h3 class="mb-6 text-2xl font-bold">Top Projects</h3>
<div class="w-full space-y-4 text-left">
  {#each stats.topRepositories.slice(0, 4) as repo, i}
    <div
      class="flex items-center gap-4 rounded-xl border {theme.current.border} {theme.current.cardBg} p-4 backdrop-blur-sm"
    >
      <div class="text-2xl font-black opacity-30">#{i + 1}</div>
      <div class="min-w-0 flex-1">
        <div class="truncate font-bold">{repo.name}</div>
        <div class="flex items-center gap-2 text-xs opacity-60">
          <span class="h-2 w-2 rounded-full" style="background-color: {repo.languageColor}"></span>
          {repo.language}
        </div>
      </div>
      <div class="font-mono font-bold {theme.current.accentText}">{repo.commits}</div>
    </div>
  {/each}
</div>

<div class="mt-8 text-center text-sm italic {theme.current.textMuted}">
  "Every commit is a brick in the castle of your dreams."
</div>
