<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';

  let { stats } = $props<{ stats: GithubStats }>();

  function getQuote(commits: number) {
    if (commits <= 10) return m.quote_10();
    if (commits <= 20) return m.quote_20();
    if (commits <= 50) return m.quote_50();
    if (commits <= 100) return m.quote_100();
    if (commits <= 200) return m.quote_200();
    if (commits <= 500) return m.quote_500();
    if (commits <= 1000) return m.quote_1000();
    return m.quote_max();
  }
</script>

<div class="space-y-8">
  <h2 class="text-4xl font-black italic {theme.current.textPrimary}">Keep Coding!</h2>
  <div class="rounded-2xl border {theme.current.border} {theme.current.cardBg} p-6 backdrop-blur-md">
    <p class="text-lg leading-relaxed {theme.current.textSecondary}">
      "{getQuote(stats.totalCommitContributions)}"
    </p>
  </div>
</div>
