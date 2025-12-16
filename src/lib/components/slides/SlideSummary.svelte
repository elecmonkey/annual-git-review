<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';
  import { settings } from '$lib/settings.svelte';

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
<style>
  .flake {
    position: absolute;
    top: -10%;
    animation-name: fall, drift;
    animation-timing-function: linear, ease-in-out;
    animation-iteration-count: infinite;
    transform: translateY(0);
  }
  @keyframes fall {
    0% { transform: translateY(-10%); }
    100% { transform: translateY(110%); }
  }
  @keyframes drift {
    0% { margin-left: 0; }
    50% { margin-left: 6px; }
    100% { margin-left: 0; }
  }
  .accent-line {
    height: 4px;
    width: 96px;
    border-radius: 9999px;
    background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
  }
</style>

<div class="relative space-y-6">

  <h2 class="text-4xl font-black italic text-center {theme.current.textPrimary}">{m.summary_keep_coding()}</h2>
  <div class="flex items-center justify-center"><div class="accent-line"></div></div>
  <p class="text-base font-medium leading-relaxed text-center {theme.current.textMuted}">{m.summary_new_year_motto()}</p>
  <p class="text-xl font-semibold leading-relaxed text-center {theme.current.textSecondary}">"{getQuote(stats.totalCommitContributions)}"</p>
</div>
