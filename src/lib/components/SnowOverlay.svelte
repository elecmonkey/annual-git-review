<script lang="ts">
  import { onMount } from 'svelte';

  const COUNT = 60;

  type Flake = {
    id: number;
    size: number;
    duration: number;
    delay: number;
    drift: number;
    x: number;
    opacity: number;
  };

  let flakes = $state<Flake[]>([]);

  onMount(() => {
    flakes = Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      size: 6 + Math.random() * 10,
      duration: 10 + Math.random() * 8,
      delay: Math.random() * 8,
      drift: 6 + Math.random() * 12,
      x: Math.random() * 100,
      opacity: 0.25 + Math.random() * 0.5
    }));
  });
</script>

<div class="snow-layer" aria-hidden="true">
  {#each flakes as flake (flake.id)}
    <svg
      class="flake"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style="
        left: {flake.x}%;
        width: {flake.size}px;
        height: {flake.size}px;
        animation-duration: {flake.duration}s, {flake.duration * 0.6}s;
        animation-delay: {flake.delay}s;
        --drift: {flake.drift}px;
        opacity: {flake.opacity};
        color: rgba(255, 255, 255, 0.95);
      "
    >
      <path
        fill="currentColor"
        d="M13.425 2.217a1 1 0 0 1 1.39 1.423l-.069.075L13 5.42v4.866l4.349-2.454l.64-2.33l.032-.097a1 1 0 0 1 1.897.626l-.482 1.756l1.817.477l.098.03a1 1 0 0 1-.504 1.926l-.1-.022l-2.405-.63L14.035 12l4.307 2.43l2.405-.63l.1-.02a1 1 0 0 1 .406 1.955l-1.817.476l.482 1.757l.021.1a1 1 0 0 1-1.918.526l-.032-.098l-.64-2.33L13 13.712v4.866l1.746 1.707l.07.075a1 1 0 0 1-1.391 1.423l-.077-.068L12 20.398l-1.348 1.317a1 1 0 0 1-1.398-1.43L11 18.578v-4.866l-4.35 2.454l-.64 2.33l-.03.098a1 1 0 0 1-1.898-.626l.482-1.757l-1.817-.476l-.098-.03a1 1 0 0 1 .504-1.926l.1.022l2.404.629L9.964 12L5.657 9.57l-2.404.63l-.1.02a1 1 0 0 1-.406-1.955l1.817-.477l-.482-1.756l-.021-.1a1 1 0 0 1 1.919-.526l.03.098l.64 2.329L11 10.287V5.421L9.254 3.715l-.07-.075a1 1 0 0 1 1.391-1.423l.077.068L12 3.602l1.348-1.317z"
      />
    </svg>
  {/each}
</div>

<style>
  .snow-layer {
    position: absolute;
    inset: -10% 0 0 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 30;
  }
  .flake {
    position: absolute;
    top: -15%;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.5));
    animation-name: fall, sway;
    animation-timing-function: linear, ease-in-out;
    animation-iteration-count: infinite;
    will-change: transform;
  }
  @keyframes fall {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(0, 120vh, 0);
    }
  }
  @keyframes sway {
    0% {
      margin-left: 0;
    }
    50% {
      margin-left: var(--drift);
    }
    100% {
      margin-left: 0;
    }
  }
</style>
