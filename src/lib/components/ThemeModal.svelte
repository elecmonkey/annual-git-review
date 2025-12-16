<script lang="ts">
  import { X } from 'lucide-svelte';
  import { theme, themes } from '$lib/theme.svelte';
  import { fade, scale } from 'svelte/transition';
  import * as m from '$lib/paraglide/messages';

  let { onClose } = $props<{ onClose: () => void }>();

  function selectTheme(id: string) {
    theme.set(id);
  }
</script>

<div
  class="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  transition:fade
>
  <div
    class="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
    in:scale={{ start: 0.95 }}
  >
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold text-white">{m.theme_select_title()}</h2>
      <button onclick={onClose} class="text-white/60 hover:text-white">
        <X size={24} />
      </button>
    </div>

    <div class="space-y-4">
      <div class="grid gap-3">
        {#each themes as t}
          <button
            class="flex items-center gap-4 rounded-xl border p-3 text-left transition-all
            {theme.current.id === t.id
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-white/5 bg-white/5 hover:bg-white/10'}"
            onclick={() => selectTheme(t.id)}
          >
            <!-- Preview Circle -->
            <div class="h-10 w-10 overflow-hidden rounded-full shadow-lg {t.background} relative">
               <div class="absolute top-0 left-0 w-full h-full opacity-50 {t.decorBlob1} blur-md scale-50 -translate-x-1/4 -translate-y-1/4"></div>
            </div>

            <div class="flex-1">
              <div class="font-bold {theme.current.id === t.id ? 'text-emerald-400' : 'text-white'}">
                {t.name}
              </div>
            </div>

            {#if theme.current.id === t.id}
              <div class="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>
