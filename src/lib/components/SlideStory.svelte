<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { ChevronLeft, ChevronRight, X, Download } from 'lucide-svelte';
  import type { GithubStats } from '$lib/server/github';
  import Chart from './Chart.svelte';
  import type { EChartsOption } from 'echarts';

  let { stats, onClose } = $props<{
    stats: GithubStats;
    onClose: () => void;
  }>();

  let currentSlide = $state(0);
  const totalSlides = 5;

  function nextSlide() {
    if (currentSlide < totalSlides - 1) currentSlide++;
  }

  function prevSlide() {
    if (currentSlide > 0) currentSlide--;
  }

  // Handle keyboard navigation
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
  }

  // Slide Components Data
  let slides = $derived([
    { id: 'intro', title: `${stats.year} GitHub Review` },
    { id: 'activity', title: 'Coding Activity' },
    { id: 'languages', title: 'Language Tech Stack' },
    { id: 'repos', title: 'Top Projects' },
    { id: 'summary', title: 'You are Amazing!' }
  ]);

  function getLanguagePieOption(data: { name: string; count: number; color: string }[]): EChartsOption {
    return {
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, position: 'outside', formatter: '{b}' },
        data: data.map(d => ({ value: d.count, name: d.name, itemStyle: { color: d.color } }))
      }]
    };
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" transition:fade>
  <!-- Controls -->
  <button onclick={onClose} class="absolute top-6 right-6 text-white/70 hover:text-white z-50">
    <X size={32} />
  </button>

  <button
    onclick={prevSlide}
    class="absolute left-4 md:left-10 text-white/50 hover:text-white disabled:opacity-0 transition-all z-50"
    disabled={currentSlide === 0}
  >
    <ChevronLeft size={48} />
  </button>

  <button
    onclick={nextSlide}
    class="absolute right-4 md:right-10 text-white/50 hover:text-white disabled:opacity-0 transition-all z-50"
    disabled={currentSlide === totalSlides - 1}
  >
    <ChevronRight size={48} />
  </button>

  <!-- Slide Container -->
  <div class="relative w-full max-w-md aspect-[9/16] bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 overflow-hidden shadow-2xl border border-white/10">

    <!-- Background Decor -->
    <div class="absolute inset-0 opacity-20 pointer-events-none">
       <div class="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] bg-emerald-500 rounded-full blur-[100px]"></div>
       <div class="absolute bottom-[-20%] right-[-20%] w-[80%] h-[50%] bg-sky-600 rounded-full blur-[100px]"></div>
    </div>

    <!-- Content Area -->
    {#key currentSlide}
      <div
        class="absolute inset-0 p-8 flex flex-col items-center justify-center text-center text-white"
        in:fly={{ y: 50, duration: 400, delay: 200 }}
        out:fade={{ duration: 200 }}
      >

        <!-- Slide 0: Intro -->
        {#if currentSlide === 0}
          <div class="space-y-6">
            <img src={stats.user.avatarUrl} alt="Avatar" class="w-32 h-32 rounded-full border-4 border-white/20 mx-auto shadow-lg" />
            <div>
              <h2 class="text-3xl font-bold mb-2">Hi, @{stats.user.login}</h2>
              <p class="text-white/80 text-lg">Your {stats.year} GitHub Journey</p>
            </div>
            <div class="text-5xl font-black bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-transparent">
              {stats.totalCommitContributions + stats.totalPullRequestContributions + stats.totalReviewContributions + stats.totalIssueContributions}
            </div>
            <p class="text-white/60 uppercase tracking-widest text-sm">Total Contributions</p>
          </div>
        {/if}

        <!-- Slide 1: Activity -->
        {#if currentSlide === 1}
           <h3 class="text-2xl font-bold mb-8">Activity Peak</h3>
           <div class="space-y-8 w-full">
             <div class="bg-white/10 p-6 rounded-xl backdrop-blur-md">
               <div class="text-4xl font-bold text-green-400 mb-2">{Math.max(...stats.contributionsByDay.map((d: { count: number }) => d.count))}</div>
               <div class="text-sm opacity-70">Most contributions in a day</div>
             </div>
             <div class="grid grid-cols-2 gap-4">
               <div class="bg-white/10 p-4 rounded-xl">
                 <div class="text-xl font-bold">{stats.totalCommitContributions}</div>
                 <div class="text-xs opacity-60">Commits</div>
               </div>
               <div class="bg-white/10 p-4 rounded-xl">
                 <div class="text-xl font-bold">{stats.totalPullRequestContributions}</div>
                 <div class="text-xs opacity-60">PRs</div>
               </div>
             </div>
           </div>
        {/if}

        <!-- Slide 2: Languages -->
        {#if currentSlide === 2}
          <h3 class="text-2xl font-bold mb-4">Tech Stack</h3>
          <div class="w-full h-64 mb-6">
             <Chart options={getLanguagePieOption(stats.topLanguages)} height="100%" />
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            {#each stats.topLanguages.slice(0, 3) as lang}
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-white/10 border border-white/10" style="color: {lang.color}">
                {lang.name}
              </span>
            {/each}
          </div>
        {/if}

        <!-- Slide 3: Repos -->
        {#if currentSlide === 3}
          <h3 class="text-2xl font-bold mb-6">Top Projects</h3>
          <div class="w-full space-y-4 text-left">
            {#each stats.topRepositories.slice(0, 4) as repo, i}
              <div class="bg-white/10 p-4 rounded-xl flex items-center gap-4 backdrop-blur-sm border border-white/5">
                <div class="text-2xl font-black opacity-30">#{i+1}</div>
                <div class="flex-1 min-w-0">
                  <div class="font-bold truncate">{repo.name}</div>
                  <div class="text-xs opacity-60 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" style="background-color: {repo.languageColor}"></span>
                    {repo.language}
                  </div>
                </div>
                <div class="font-mono font-bold text-green-300">{repo.commits}</div>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Slide 4: Summary -->
        {#if currentSlide === 4}
          <div class="space-y-8">
            <h2 class="text-4xl font-black italic">Keep Coding!</h2>
            <div class="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <p class="text-lg leading-relaxed">
                "Another year of commits, another year of growth. The world runs on code, and you are building it."
              </p>
            </div>
            <div class="pt-8 opacity-50 text-sm">
              Generated by Annual Git Review
            </div>
          </div>
        {/if}

      </div>
    {/key}

    <!-- Progress Bar -->
    <div class="absolute top-0 left-0 right-0 flex gap-1 p-2 z-20">
      {#each Array(totalSlides) as _, i}
        <div class="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
          <div
            class="h-full bg-white transition-all duration-300 ease-out"
            style="width: {i <= currentSlide ? '100%' : '0%'}"
          ></div>
        </div>
      {/each}
    </div>

  </div>
</div>
