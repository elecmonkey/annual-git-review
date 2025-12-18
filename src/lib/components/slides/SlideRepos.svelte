<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import { settings } from '$lib/settings.svelte';
  import * as m from '$lib/paraglide/messages';

  let { stats } = $props<{ stats: GithubStats }>();
</script>

<div class="mb-6 flex items-center gap-3 text-left">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 {theme.current.textPrimary}" viewBox="0 0 24 24" fill="currentColor">
    <path d="m9.6 15.6l1.4-1.425L8.825 12L11 9.825L9.6 8.4L6 12zm4.8 0L18 12l-3.6-3.6L13 9.825L15.175 12L13 14.175zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"/>
  </svg>
  <h3 class="text-2xl font-bold">{m.top_repos_title()}</h3>
</div>
<div class="w-full space-y-4 text-left">
  {#each stats.topRepositories.slice(0, settings.repoCount) as repo, i}
    <div
      class="flex items-center gap-4 rounded-xl border {theme.current.border} {theme.current
        .cardBg} p-4 backdrop-blur-sm"
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
