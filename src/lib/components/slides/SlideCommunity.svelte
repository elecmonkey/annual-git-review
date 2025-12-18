<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';

  let { stats } = $props<{ stats: GithubStats }>();

  function formatValue(n: number | undefined | null) {
    return (n ?? 0).toLocaleString();
  }

  function getCommunityLine(
    issueCount: number | undefined | null,
    reviewCount: number | undefined | null
  ) {
    const total = (issueCount ?? 0) + (reviewCount ?? 0);
    if (total === 0) return 'Quiet hallway this year — maybe drop a hello next time.';
    if (total < 10) return 'You chimed in here and there — every voice counts.';
    if (total < 40) return 'You kept threads moving — solid collaboration energy.';
    if (total < 100) return 'You were part of the buzz — thanks for showing up.';
    return 'Conversation catalyst — you helped shape the dialogue.';
  }
</script>

<div class="flex h-full w-full flex-col items-start justify-center gap-6 overflow-hidden text-left">
  <div class="flex items-center gap-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-8 {theme.current.textPrimary}"
      viewBox="0 0 12 12"
      fill="currentColor"
    >
      <path
        d="M4.25 3.25a1.75 1.75 0 1 1 3.5 0a1.75 1.75 0 0 1-3.5 0m-2 2.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5M11 4.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M5.25 6C4.56 6 4 6.56 4 7.25V8.5a2 2 0 1 0 4 0V7.25C8 6.56 7.44 6 6.75 6zM3 7.25c0-.289.054-.565.154-.818l-1.231.33a1.25 1.25 0 0 0-.884 1.53l.194.725a2 2 0 0 0 2.45 1.414l.017-.005A3 3 0 0 1 3 8.5zM9 8.5c0 .733-.263 1.405-.7 1.927l.016.004a2 2 0 0 0 2.449-1.414l.194-.725a1.25 1.25 0 0 0-.884-1.53l-1.228-.33c.099.254.153.53.153.818z"
      />
    </svg>
    <h2 class="text-2xl leading-snug font-black {theme.current.textPrimary}">
      {m.community_title()}
    </h2>
  </div>
  <p class="max-w-xl text-sm font-medium {theme.current.textMuted}">{m.community_desc()}</p>

  <div class="flex w-full max-w-md flex-col gap-4">
    <div class="px-1 py-1">
      <div
        class="flex items-center justify-between text-xs font-semibold uppercase {theme.current
          .textMuted}"
      >
        <span>{m.community_issue_comments()}</span>
      </div>
      <div class="mt-3 text-3xl font-black {theme.current.textPrimary}">
        {formatValue(stats.issueCommentsCount)}
      </div>
    </div>

    <div class="px-1 py-1">
      <div
        class="flex items-center justify-between text-xs font-semibold uppercase {theme.current
          .textMuted}"
      >
        <span>{m.community_review_comments()}</span>
      </div>
      <div class="mt-3 text-3xl font-black {theme.current.textPrimary}">
        {formatValue(stats.reviewCommentsCount)}
      </div>
    </div>
  </div>

  <p class="mt-2 text-sm italic {theme.current.textMuted}">
    {getCommunityLine(stats.issueCommentsCount, stats.reviewCommentsCount)}
  </p>
</div>
