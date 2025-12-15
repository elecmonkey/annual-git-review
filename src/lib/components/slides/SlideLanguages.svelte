<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import Chart from '../Chart.svelte';
  import type { EChartsOption } from 'echarts';

  let { stats } = $props<{ stats: GithubStats }>();

  function getLanguagePieOption(
    data: { name: string; count: number; color: string }[]
  ): EChartsOption {
    return {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, position: 'outside', formatter: '{b}' },
          data: data.map((d) => ({
            value: d.count,
            name: d.name,
            itemStyle: { color: d.color }
          }))
        }
      ]
    };
  }
</script>

<h3 class="mb-4 text-2xl font-bold">Tech Stack</h3>
<div class="mb-6 h-64 w-full">
  <Chart options={getLanguagePieOption(stats.topLanguages)} height="100%" />
</div>
<div class="flex flex-wrap justify-center gap-2">
  {#each stats.topLanguages.slice(0, 3) as lang}
    <span
      class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium"
      style="color: {lang.color}"
    >
      {lang.name}
    </span>
  {/each}
</div>
