<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import Chart from '../Chart.svelte';
  import type { EChartsOption } from 'echarts';
  import { theme } from '$lib/theme.svelte';
  import { settings } from '$lib/settings.svelte';

  let { stats } = $props<{ stats: GithubStats }>();

  function getLanguageMessage(lang: string): string {
    const l = lang.toLowerCase();
    if (['javascript', 'typescript', 'vue', 'svelte', 'html', 'css', 'astro', 'react'].some(k => l.includes(k))) {
      return "The web is your canvas, and you paint it with logic and style.";
    }
    if (['python', 'jupyter'].some(k => l.includes(k))) {
      return "Data science, AI, or scripts—Python is your snake charmer.";
    }
    if (['java', 'kotlin', 'scala', 'groovy'].some(k => l.includes(k))) {
      return "Enterprise grade, robust and scalable. You build systems that last.";
    }
    if (['go', 'golang'].some(k => l.includes(k))) {
      return "Simplicity is complicated. You value performance and concurrency.";
    }
    if (['rust'].some(k => l.includes(k))) {
      return "Memory safety and blazingly fast. You are rewriting the world.";
    }
    if (['c++', 'c', 'cpp'].some(k => l === k || l === 'c++')) {
      return "Close to the metal. You understand how machines truly think.";
    }
    if (['c#', 'csharp', '.net'].some(k => l.includes(k))) {
      return "The power of .NET flows through your keyboard.";
    }
    if (['php'].some(k => l === k)) {
      return "Powering the web, one request at a time. The classic never dies.";
    }
    if (['ruby'].some(k => l.includes(k))) {
      return "Designed for developer happiness. You write code that reads like poetry.";
    }
    if (['swift', 'objective-c'].some(k => l.includes(k))) {
      return "Crafting beautiful experiences for the Apple ecosystem.";
    }
    if (['dart', 'flutter'].some(k => l.includes(k))) {
      return "Building for every screen with a single codebase.";
    }
    if (['elixir', 'erlang'].some(k => l.includes(k))) {
      return "Concurrency is your playground. You build systems that never crash.";
    }
    if (['haskell', 'ocaml', 'f#', 'clojure'].some(k => l.includes(k))) {
      return "Functional programming purity. You think in expressions, not statements.";
    }
    if (['shell', 'bash', 'zsh', 'powershell'].some(k => l.includes(k))) {
      return "Automating the boring stuff. The terminal is your home.";
    }
    if (['sql', 'plpg'].some(k => l.includes(k))) {
      return "Data is the new oil, and you know how to query it.";
    }
    if (['lua'].some(k => l.includes(k))) {
      return "Small, fast, and embeddable. Scripting the impossible.";
    }
    if (['perl'].some(k => l.includes(k))) {
      return "There's more than one way to do it, and you know them all.";
    }
    if (['r'].some(k => l === 'r')) {
      return "Statistics and visualization. You find truth in data.";
    }
    if (['julia'].some(k => l.includes(k))) {
      return "High-performance numerical analysis. Math is your native language.";
    }
    if (['assembly'].some(k => l.includes(k))) {
      return "You speak the language of the processor itself. Respect.";
    }

    return "A polyglot explorer, mastering tools to build the future.";
  }

  let topLangMessage = $derived(
    stats.topLanguages.length > 0
      ? getLanguageMessage(stats.topLanguages[0].name)
      : ""
  );

  function getLanguagePieOption(
    data: { name: string; count: number; color: string }[]
  ): EChartsOption {
    return {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          itemStyle: { borderRadius: 8 },
          label: {
            show: true,
            position: 'outside',
            formatter: (params: any) => {
              // Only show label if it's within the top N languages
              return params.dataIndex < settings.languageCount ? params.name : '';
            },
            color: theme.current.chartColors.text
          },
          labelLine: {
             show: true,
             showAbove: true,
             length: 15,
             length2: 10,
             smooth: true
          },
          data: data.map((d) => ({
            value: d.count,
            name: d.name,
            itemStyle: { color: d.color },
            labelLine: { show: true } // Ensure lines are potentially shown
          })).map((d, i) => ({
              ...d,
              label: { show: i < settings.languageCount },
              labelLine: { show: i < settings.languageCount }
          }))
        }
      ]
    };
  }

  let chartOptions = $derived(getLanguagePieOption(stats.topLanguages));
</script>

<h3 class="mb-4 text-2xl font-bold">Tech Stack</h3>
<div class="mb-6 h-64 w-full">
  <Chart options={chartOptions} height="100%" />
</div>
<div class="flex flex-wrap justify-center gap-2">
  {#each stats.topLanguages.slice(0, settings.languageCount) as lang}
    <span
      class="rounded-full border {theme.current.border} {theme.current.cardBg} px-3 py-1 text-sm font-medium"
      style="color: {lang.color}"
    >
      {lang.name}
    </span>
  {/each}
</div>

{#if topLangMessage}
  <div class="mt-8 rounded-lg {theme.current.cardBg} p-4 text-center text-sm italic {theme.current.textSecondary} backdrop-blur-sm">
    "{topLangMessage}"
  </div>
{/if}
