<script lang="ts">
  import { X } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';
  import { settings } from '$lib/settings.svelte';

  let { onClose } = $props<{ onClose: () => void }>();
</script>

<div
  class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
  transition:fade
>
  <div
    class="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
    in:scale={{ start: 0.95 }}
  >
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold text-white">Settings</h2>
      <button onclick={onClose} class="text-white/60 hover:text-white">
        <X size={24} />
      </button>
    </div>

    <div class="space-y-6">
      <!-- Language Count Setting -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium uppercase tracking-wider text-white/50">Tech Stack Count</h3>
          <span class="text-sm font-bold text-white">{settings.languageCount}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          bind:value={settings.languageCount}
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-emerald-500"
        />
        <p class="text-xs text-white/40">
          Number of languages to show in badges and pie chart.
        </p>
      </div>

      <!-- Repo Count Setting -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium uppercase tracking-wider text-white/50">Top Projects Count</h3>
          <span class="text-sm font-bold text-white">{settings.repoCount}</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          bind:value={settings.repoCount}
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-emerald-500"
        />
        <p class="text-xs text-white/40">
          Number of top repositories to display.
        </p>
      </div>

      <!-- OSS Count Setting -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium uppercase tracking-wider text-white/50">Open Source Count</h3>
          <span class="text-sm font-bold text-white">{settings.ossCount}</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          bind:value={settings.ossCount}
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-emerald-500"
        />
        <p class="text-xs text-white/40">
          Number of open source contributions to display.
        </p>
      </div>
    </div>
  </div>
</div>
