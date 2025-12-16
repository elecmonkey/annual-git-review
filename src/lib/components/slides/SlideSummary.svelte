<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';
  import { getLanguage } from '$lib/i18n.svelte';

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

<div class="summary-container">
  <div class="relative z-30 space-y-6 text-center">
    <h2 class="text-4xl font-black italic {theme.current.textPrimary}">
      {m.summary_keep_coding()}
    </h2>
    <div class="flex items-center justify-center"><div class="accent-line"></div></div>
    <p class="text-base leading-relaxed font-medium {theme.current.textMuted}">
      {getLanguage() === 'zh-CN'
        ? '愿你在新的一年里，保持好奇、自在创作。'
        : 'In the new year, stay curious and create with joy.'}
    </p>
    <p class="text-xl leading-relaxed font-semibold {theme.current.textSecondary}">
      "{getQuote(stats.totalCommitContributions)}"
    </p>
  </div>
</div>

<style>
  .summary-container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 0 1.5rem;
  }
  .accent-line {
    height: 4px;
    width: 96px;
    border-radius: 9999px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2));
  }
</style>
