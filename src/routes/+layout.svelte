<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { onMount } from 'svelte';
  import { initI18n } from '$lib/i18n.svelte';

  let { children } = $props();

  onMount(() => {
    initI18n();
  });
</script>

<svelte:head>
  <title>Annual Git Review</title>
  <link rel="icon" href={favicon} />
</svelte:head>
{@render children()}
