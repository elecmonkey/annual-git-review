<script lang="ts">
  import { onMount } from 'svelte';
  import echarts from '$lib/echarts';
  import type { EChartsOption } from 'echarts';

  let {
    options,
    height = '400px',
    class: className = ''
  } = $props<{
    options: EChartsOption;
    height?: string;
    class?: string;
  }>();

  let chartContainer: HTMLDivElement | undefined = $state();
  let chartInstance: echarts.ECharts | null = null;

  function initChart() {
    if (chartContainer && !chartInstance) {
      chartInstance = echarts.init(chartContainer);
      chartInstance.setOption(options);
    }
  }

  $effect(() => {
    if (chartInstance && options) {
      // Clear chart to ensure full re-render when options change
      chartInstance.clear();
      chartInstance.setOption(options);
    }
  });

  onMount(() => {
    initChart();

    const handleResize = () => {
      chartInstance?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance?.dispose();
    };
  });
</script>

<div bind:this={chartContainer} style="height: {height}; width: 100%;" class={className}></div>
