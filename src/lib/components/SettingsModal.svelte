<script lang="ts">
  import { X } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

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

    <div class="space-y-6 text-center text-white/60">
      <p>More settings coming soon...</p>
    </div>
  </div>
</div>
