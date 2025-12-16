<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';
  import { settings } from '$lib/settings.svelte';
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

<div class="relative space-y-6">
  {#if settings.showSnow}
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      {#each Array(36) as _}
        <svg
          class="flake"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          stroke-width="1.2"
          stroke-linecap="round"
          style="
            left: {Math.random() * 100}%;
            animation-delay: {Math.random() * 5}s;
            animation-duration: {8 + Math.random() * 6}s, {3 + Math.random() * 3}s;
            width: {6 + Math.random() * 8}px;
            height: {6 + Math.random() * 8}px;
            opacity: {0.35 + Math.random() * 0.5};
          "
        >
          <g>
            <path d="M12 2v20" />
            <path d="M4 6l16 12" />
            <path d="M4 18l16-12" />
            <path d="M7 4l2 2" />
            <path d="M15 4l2 2" />
            <path d="M7 20l2-2" />
            <path d="M15 20l2-2" />
          </g>
        </svg>
      {/each}
    </div>
  {/if}

  <h2 class="text-center text-4xl font-black italic {theme.current.textPrimary}">
    {m.summary_keep_coding()}
  </h2>
  <div class="flex items-center justify-center"><div class="accent-line"></div></div>
  <p class="text-center text-base leading-relaxed font-medium {theme.current.textMuted}">
    {getLanguage() === 'zh-CN'
      ? '新的一年，继续热爱、持续交付。'
      : 'In the new year, stay passionate and keep delivering.'}
  </p>
  <p class="text-center text-xl leading-relaxed font-semibold {theme.current.textSecondary}">
    "{getQuote(stats.totalCommitContributions)}"
  </p>
</div>

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
    0% {
      transform: translateY(-10%);
    }
    100% {
      transform: translateY(110%);
    }
  }
  @keyframes drift {
    0% {
      margin-left: 0;
    }
    50% {
      margin-left: 6px;
    }
    100% {
      margin-left: 0;
    }
  }
  .accent-line {
    height: 4px;
    width: 96px;
    border-radius: 9999px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2));
  }
</style>
