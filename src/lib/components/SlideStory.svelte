<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { ChevronLeft, ChevronRight, X, Download, Settings } from 'lucide-svelte';
  import type { GithubStats } from '$lib/server/github';
  import { toPng } from 'html-to-image';
  import { theme } from '$lib/theme.svelte';
  import SettingsModal from './SettingsModal.svelte';

  // Import extracted slide components
  import SlideIntro from './slides/SlideIntro.svelte';
  import SlideActivity from './slides/SlideActivity.svelte';
  import SlideLanguages from './slides/SlideLanguages.svelte';
  import SlideRepos from './slides/SlideRepos.svelte';
  import SlideOpenSource from './slides/SlideOpenSource.svelte';
  import SlideSummary from './slides/SlideSummary.svelte';

  let { stats, onClose } = $props<{
    stats: GithubStats;
    onClose: () => void;
  }>();

  let currentSlide = $state(0);
  const totalSlides = 6;
  let slideRef: HTMLElement | undefined = $state();
  let isDownloading = $state(false);
  let showSettings = $state(false);

  function nextSlide() {
    if (currentSlide < totalSlides - 1) currentSlide++;
  }

  function prevSlide() {
    if (currentSlide > 0) currentSlide--;
  }

  async function downloadSlide() {
    if (!slideRef) return;
    isDownloading = true;
    try {
      // Small delay to ensure any transitions are finished or UI is stable if needed
      // but usually html-to-image handles static snapshot well.
      const dataUrl = await toPng(slideRef, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `git-review-2024-slide-${currentSlide + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download slide:', err);
    } finally {
      isDownloading = false;
    }
  }

  // Handle keyboard navigation
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
  transition:fade
>
  <!-- Controls -->
  <button onclick={onClose} class="absolute right-6 top-6 z-50 text-white/70 hover:text-white">
    <X size={32} />
  </button>

  <button
    onclick={() => (showSettings = true)}
    class="absolute right-20 top-7 z-50 text-white/70 transition-all hover:text-white"
    title="Settings"
  >
    <Settings size={28} />
  </button>

  <button
    onclick={downloadSlide}
    disabled={isDownloading}
    class="absolute right-32 top-7 z-50 text-white/70 transition-all hover:text-white disabled:opacity-50"
    title="Download Slide"
  >
    <Download size={28} />
  </button>

  <button
    onclick={prevSlide}
    class="absolute left-4 z-50 text-white/50 transition-all hover:text-white disabled:opacity-0 md:left-10"
    disabled={currentSlide === 0}
  >
    <ChevronLeft size={48} />
  </button>

  <button
    onclick={nextSlide}
    class="absolute right-4 z-50 text-white/50 transition-all hover:text-white disabled:opacity-0 md:right-10"
    disabled={currentSlide === totalSlides - 1}
  >
    <ChevronRight size={48} />
  </button>

  <!-- Slide Container -->
  <div
    bind:this={slideRef}
    class="relative aspect-[9/16] w-full max-w-md overflow-hidden shadow-2xl {theme.current.background} {theme.current.border}"
  >
    <!-- Background Decor -->
    <div class="pointer-events-none absolute inset-0 opacity-20">
      <div
        class="absolute -left-[20%] -top-[20%] h-[50%] w-[80%] rounded-full blur-[100px] {theme.current.decorBlob1}"
      ></div>
      <div
        class="absolute -bottom-[20%] -right-[20%] h-[50%] w-[80%] rounded-full blur-[100px] {theme.current.decorBlob2}"
      ></div>
    </div>

    <!-- Content Area -->
    {#key currentSlide}
      <div
        class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center {theme.current.textPrimary}"
        in:fly={{ y: 50, duration: 400, delay: 200 }}
        out:fade={{ duration: 200 }}
      >
        {#if currentSlide === 0}
          <SlideIntro {stats} />
        {:else if currentSlide === 1}
          <SlideActivity {stats} />
        {:else if currentSlide === 2}
          <SlideLanguages {stats} />
        {:else if currentSlide === 3}
          <SlideRepos {stats} />
        {:else if currentSlide === 4}
          <SlideOpenSource {stats} />
        {:else if currentSlide === 5}
          <SlideSummary {stats} />
        {/if}
      </div>
    {/key}
  </div>

  <!-- Progress Bar (Moved Outside) -->
  <div class="mt-6 flex w-full max-w-md gap-2 px-4">
    {#each Array(totalSlides) as _, i}
      <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
        <div
          class="h-full bg-white transition-all duration-300 ease-out"
          style="width: {i <= currentSlide ? '100%' : '0%'}"
        ></div>
      </div>
    {/each}
  </div>

  {#if showSettings}
    <SettingsModal onClose={() => (showSettings = false)} />
  {/if}
</div>
