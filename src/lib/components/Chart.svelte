<script lang="ts">
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';

	let {
		options,
		height = '400px',
		class: className = ''
	} = $props<{
		options: echarts.EChartsOption;
		height?: string;
		class?: string;
	}>();

	let chartContainer: HTMLDivElement;
	let chartInstance: echarts.ECharts | null = null;

	function initChart() {
		if (chartContainer && !chartInstance) {
			chartInstance = echarts.init(chartContainer);
			chartInstance.setOption(options);
		}
	}

	// Effect to update chart when options change
	$effect(() => {
		if (chartInstance && options) {
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
