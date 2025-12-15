<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Chart from '$lib/components/Chart.svelte';
	import {
		Loader2,
		Github,
		Calendar,
		Code,
		GitCommit,
		GitPullRequest,
		MessageSquare,
		Star
	} from 'lucide-svelte';
	import * as echarts from 'echarts';

	let { form } = $props<{ form: ActionData }>();
	let loading = $state(false);

	function getHeatmapOptions(
		data: { date: string; count: number }[],
		year: number
	): echarts.EChartsOption {
		// Map data to [date, count] format
		const heatmapData = data.map((item) => [item.date, item.count]);
		const max = Math.max(...data.map((d) => d.count), 5); // Ensure at least some scale

		return {
			tooltip: {
				position: 'top',
				formatter: function (p: unknown) {
					const params = p as { data: [string, number] };
					const format = echarts.format.formatTime('yyyy-MM-dd', params.data[0]);
					return format + ': ' + params.data[1];
				}
			},
			visualMap: {
				min: 0,
				max: max,
				calculable: true,
				orient: 'horizontal',
				left: 'center',
				top: 'top',
				inRange: {
					color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
				}
			},
			calendar: {
				top: 60,
				left: 30,
				right: 30,
				cellSize: ['auto', 13] as const,
				range: year,
				itemStyle: {
					borderWidth: 0.5
				},
				yearLabel: { show: false }
			},
			series: {
				type: 'heatmap',
				coordinateSystem: 'calendar',
				data: heatmapData
			}
		};
	}

	function getLanguageOptions(
		data: { name: string; count: number; color: string }[]
	): echarts.EChartsOption {
		return {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				top: '5%',
				left: 'center'
			},
			series: [
				{
					name: 'Languages',
					type: 'pie',
					radius: ['40%', '70%'],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
						borderColor: '#fff',
						borderWidth: 2
					},
					label: {
						show: false,
						position: 'center'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 20,
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: false
					},
					data: data.map((d) => ({
						value: d.count,
						name: d.name,
						itemStyle: { color: d.color }
					}))
				}
			]
		};
	}

	function getRepoOptions(
		data: { name: string; commits: number; languageColor: string | null }[]
	): echarts.EChartsOption {
		return {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				boundaryGap: [0, 0.01]
			},
			yAxis: {
				type: 'category',
				data: data.map((d) => d.name).reverse() // Top at top
			},
			series: [
				{
					name: 'Commits',
					type: 'bar',
					data: data
						.map((d) => ({
							value: d.commits,
							itemStyle: {
								color: d.languageColor || '#5470c6'
							}
						}))
						.reverse()
				}
			]
		};
	}
</script>

<div class="min-h-screen bg-gray-50 pb-10 font-sans text-gray-900">
	<!-- Header -->
	<header class="mb-8 border-b border-gray-200 bg-white px-4 py-6">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<div class="flex items-center gap-3">
				<Github class="h-8 w-8" />
				<h1 class="text-2xl font-bold tracking-tight">Annual Git Review</h1>
			</div>
			{#if form?.stats}
				<button
					class="text-sm text-gray-500 underline hover:text-gray-900"
					onclick={() => window.location.reload()}
				>
					New Report
				</button>
			{/if}
		</div>
	</header>

	<main class="mx-auto max-w-6xl px-4">
		{#if !form?.stats}
			<!-- Input Form -->
			<div class="mx-auto mt-10 max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
				<h2 class="mb-6 text-xl font-semibold">Generate Your Report</h2>

				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="token" class="mb-1 block text-sm font-medium text-gray-700"
							>GitHub Personal Access Token</label
						>
						<input
							type="password"
							name="token"
							id="token"
							required
							placeholder="ghp_..."
							class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-black"
						/>
						<p class="mt-1 text-xs text-gray-500">
							Token requires <code>read:user</code> scope. It is not stored.
						</p>
					</div>

					<div>
						<label for="year" class="mb-1 block text-sm font-medium text-gray-700">Year</label>
						<input
							type="number"
							name="year"
							id="year"
							value={new Date().getFullYear()}
							class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-black"
						/>
					</div>

					{#if form?.error}
						<div class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
							{form.message}
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if loading}
							<Loader2 class="h-4 w-4 animate-spin" />
							Generating...
						{:else}
							Generate Report
						{/if}
					</button>
				</form>
			</div>
		{:else if form.stats}
			<!-- Report View -->
			{@const stats = form.stats}

			<!-- Profile Section -->
			<div
				class="mb-6 flex flex-col items-center gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row"
			>
				<img
					src={stats.user.avatarUrl}
					alt={stats.user.login}
					class="h-24 w-24 rounded-full border-4 border-gray-100"
				/>
				<div class="text-center md:text-left">
					<h2 class="text-3xl font-bold">{stats.user.name}</h2>
					<p class="text-lg text-gray-500">@{stats.user.login}</p>
				</div>
				<div class="flex-grow"></div>
				<div class="rounded-lg bg-gray-50 p-4 text-center md:text-right">
					<div class="text-sm font-semibold tracking-wider text-gray-500 uppercase">
						Total Contributions
					</div>
					<div class="text-4xl font-bold text-green-600">
						{stats.totalCommitContributions +
							stats.totalPullRequestContributions +
							stats.totalReviewContributions +
							stats.totalIssueContributions}
					</div>
					<div class="text-sm text-gray-400">in {stats.year}</div>
				</div>
			</div>

			<!-- Stats Grid -->
			<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
				<div
					class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
				>
					<div class="rounded-lg bg-blue-50 p-3 text-blue-600">
						<GitCommit class="h-6 w-6" />
					</div>
					<div>
						<div class="text-2xl font-bold">{stats.totalCommitContributions}</div>
						<div class="text-sm text-gray-500">Commits</div>
					</div>
				</div>
				<div
					class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
				>
					<div class="rounded-lg bg-purple-50 p-3 text-purple-600">
						<GitPullRequest class="h-6 w-6" />
					</div>
					<div>
						<div class="text-2xl font-bold">{stats.totalPullRequestContributions}</div>
						<div class="text-sm text-gray-500">Pull Requests</div>
					</div>
				</div>
				<div
					class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
				>
					<div class="rounded-lg bg-orange-50 p-3 text-orange-600">
						<MessageSquare class="h-6 w-6" />
					</div>
					<div>
						<div class="text-2xl font-bold">{stats.totalReviewContributions}</div>
						<div class="text-sm text-gray-500">Reviews</div>
					</div>
				</div>
				<div
					class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
				>
					<div class="rounded-lg bg-green-50 p-3 text-green-600">
						<Star class="h-6 w-6" />
					</div>
					<div>
						<div class="text-2xl font-bold">{stats.totalIssueContributions}</div>
						<div class="text-sm text-gray-500">Issues</div>
					</div>
				</div>
			</div>

			<!-- Contribution Calendar -->
			<div class="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Calendar class="h-5 w-5 text-gray-500" />
					Contribution Calendar
				</h3>
				<Chart options={getHeatmapOptions(stats.contributionsByDay, stats.year)} height="200px" />
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<!-- Top Languages -->
				<div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
					<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
						<Code class="h-5 w-5 text-gray-500" />
						Top Languages
					</h3>
					<Chart options={getLanguageOptions(stats.topLanguages)} height="400px" />
				</div>

				<!-- Top Repositories -->
				<div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
					<h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
						<Github class="h-5 w-5 text-gray-500" />
						Top Repositories
					</h3>
					<Chart options={getRepoOptions(stats.topRepositories)} height="400px" />
				</div>
			</div>
		{/if}
	</main>
</div>
