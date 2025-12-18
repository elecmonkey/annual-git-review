<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { ChevronLeft, ChevronRight, X, Download, Settings, Palette } from 'lucide-svelte';
  import type { GithubStats } from '$lib/server/github';
  import { toPng } from 'html-to-image';
  import { theme } from '$lib/theme.svelte';
  import { settings } from '$lib/settings.svelte';
  import { browser } from '$app/environment';
  import ThemeModal from './ThemeModal.svelte';
  import SettingsModal from './SettingsModal.svelte';
  import GithubIcon from '$lib/components/GitHubIcon.svelte';
  import * as m from '$lib/paraglide/messages';

  // Import extracted slide components
  import SlideIntro from './slides/SlideIntro.svelte';
  import SlideActivity from './slides/SlideActivity.svelte';
  import SlideLanguages from './slides/SlideLanguages.svelte';
  import SlideRepos from './slides/SlideRepos.svelte';
  import SlideCommunity from './slides/SlideCommunity.svelte';
  import SlideOpenSource from './slides/SlideOpenSource.svelte';
  import SlideSummary from './slides/SlideSummary.svelte';
  import SlideLateNight from './slides/SlideLateNight.svelte';
  import SnowOverlay from './SnowOverlay.svelte';

  let { stats, onClose } = $props<{
    stats: GithubStats;
    onClose: () => void;
  }>();

  let currentSlide = $state(0);
  let totalSlides = $state(8);
  let slideRef: HTMLElement | undefined = $state();
  let isDownloading = $state(false);
  let showTheme = $state(false);
  let showSettings = $state(false);

  $effect(() => {
    if (browser) {
      localStorage.setItem('git-review-settings', JSON.stringify(settings));
    }
  });

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

  function computeLateNightRatio(s: GithubStats) {
    const hours = s.commitHoursUTC || [];
    if (hours.length === 0) return 0;
    const offsetMinutes = -new Date().getTimezoneOffset();
    let total = 0;
    let night = 0;
    for (let utcHour = 0; utcHour < hours.length; utcHour++) {
      const count = hours[utcHour] || 0;
      total += count;
      let localMinutes = (utcHour * 60 + offsetMinutes) % (24 * 60);
      if (localMinutes < 0) localMinutes += 24 * 60;
      const localHour = Math.floor(localMinutes / 60);
      if (localHour === 23 || localHour < 6) night += count;
    }
    if (total === 0) return 0;
    return night / total;
  }

  let hasLateNight = $state(false);
  $effect(() => {
    const ratio = computeLateNightRatio(stats);
    hasLateNight = ratio > 0.2;
    totalSlides = hasLateNight ? 8 : 7;
    if (!hasLateNight && currentSlide === 6) currentSlide = 6;
    if (!hasLateNight && currentSlide > 6) currentSlide = 6;
  });

  let showSnowNow = $derived(
    settings.showSnow &&
      ((hasLateNight && currentSlide === 7) || (!hasLateNight && currentSlide === 6))
  );
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
  transition:fade
>
  <button onclick={onClose} class="absolute top-6 right-6 z-50 text-white/70 hover:text-white">
    <X size={32} />
  </button>

  <button
    onclick={() => (showSettings = true)}
    class="absolute top-7 right-20 z-50 text-white/70 transition-all hover:text-white"
    title="Settings"
  >
    <Settings size={28} />
  </button>

  <button
    onclick={() => (showTheme = true)}
    class="absolute top-7 right-32 z-50 text-white/70 transition-all hover:text-white"
    title="Change Theme"
  >
    <Palette size={28} />
  </button>

  <button
    onclick={downloadSlide}
    disabled={isDownloading}
    class="absolute top-7 right-44 z-50 text-white/70 transition-all hover:text-white disabled:opacity-50"
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
    class="relative aspect-9/16 w-full max-w-md overflow-hidden shadow-2xl {theme.current
      .background} {theme.current.border}"
  >
    <!-- Background Decor -->
    <div class="pointer-events-none absolute inset-0 opacity-20">
      <div
        class="absolute -top-[20%] -left-[20%] h-[50%] w-[80%] rounded-full blur-[100px] {theme
          .current.decorBlob1}"
      ></div>
      <div
        class="absolute -right-[20%] -bottom-[20%] h-[50%] w-[80%] rounded-full blur-[100px] {theme
          .current.decorBlob2}"
      ></div>
    </div>

    {#if showSnowNow}
      <SnowOverlay />
    {/if}

    <!-- Content Area -->
    {#key currentSlide}
      <div
        class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center {theme
          .current.textPrimary} z-40"
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
          <SlideCommunity {stats} />
        {:else if currentSlide === 5}
          <SlideOpenSource {stats} />
        {:else if currentSlide === 6}
          {#if hasLateNight}
            <SlideLateNight {stats} />
          {:else}
            <SlideSummary {stats} />
          {/if}
        {:else if currentSlide === 7}
          {#if hasLateNight}
            <SlideSummary {stats} />
          {/if}
        {/if}
      </div>
    {/key}

    {#if settings.showFooter}
      <div
        class="absolute bottom-4 left-0 w-full text-center text-[12px] opacity-40 {theme.current
          .textMuted} flex items-center justify-center gap-1.5"
      >
        <span>{m.generated_by()}</span>
        <GithubIcon class="h-4 w-4" />
        <a
          class="font-semibold"
          href="https://github.com/elecmonkey/annual-git-review"
          target="_blank">annual-git-review</a
        >
      </div>
    {/if}
  </div>

  <!-- Progress Bar (Moved Outside) -->
  <div class="mt-6 flex w-full max-w-md gap-2 px-4">
    {#each Array.from({ length: totalSlides }, (_, i) => i) as i (i)}
      <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
        <div
          class="h-full bg-white transition-all duration-300 ease-out"
          style="width: {i <= currentSlide ? '100%' : '0%'}"
        ></div>
      </div>
    {/each}
  </div>

  {#if showTheme}
    <ThemeModal onClose={() => (showTheme = false)} />
  {/if}

  {#if showSettings}
    <SettingsModal onClose={() => (showSettings = false)} />
  {/if}
</div>
