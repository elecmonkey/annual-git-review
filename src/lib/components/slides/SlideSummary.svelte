<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';

  let { stats } = $props<{ stats: GithubStats }>();

  function getQuote(commits: number) {
    if (commits <= 10) return "Every great project starts with a single line of code. Keep exploring!";
    if (commits <= 20) return "You're finding your rhythm. Every commit is a step forward in your journey.";
    if (commits <= 50) return "Consistency builds mastery. You're planting seeds for the future.";
    if (commits <= 100) return "Your code is taking shape. Keep building, keep learning, keep growing.";
    if (commits <= 200) return "The world runs on code, and you're part of the engine. Keep pushing boundaries.";
    if (commits <= 500) return "Creativity meets logic. You're turning ideas into reality, one commit at a time.";
    if (commits <= 1000) return "Passion fuels progress. Your dedication to the craft is inspiring.";
    return "The limit is your imagination. Continue to innovate and shape the digital world.";
  }
</script>

<div class="space-y-8">
  <h2 class="text-4xl font-black italic {theme.current.textPrimary}">Keep Coding!</h2>
  <div class="rounded-2xl border {theme.current.border} {theme.current.cardBg} p-6 backdrop-blur-md">
    <p class="text-lg leading-relaxed {theme.current.textSecondary}">
      "{getQuote(stats.totalCommitContributions)}"
    </p>
  </div>
</div>
