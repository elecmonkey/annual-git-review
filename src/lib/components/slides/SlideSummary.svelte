<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import { theme } from '$lib/theme.svelte';
  import * as m from '$lib/paraglide/messages';

  let { stats } = $props<{ stats: GithubStats }>();

  function getQuote(commits: number) {
    if (commits <= 10) return m.quote_10();
    if (commits <= 20) return m.quote_20();
    if (commits <= 50) return m.quote_50();
    if (commits <= 100) return m.quote_100();
    if (commits <= 200) return m.quote_200();
    if (commits <= 500) return m.quote_500();
    if (commits <= 1000) return m.quote_1000();
    return m.quote_max();
  }

  function formatValue(n: number | undefined | null) {
    return (n ?? 0).toLocaleString();
  }

  const highlightStats = $derived<{ label: string; value: number | undefined | null }[]>([
    { label: m.common_commits(), value: stats.totalCommitContributions },
    { label: m.common_pull_requests(), value: stats.totalPullRequestContributions }
  ]);

  const socialStats = $derived<{ label: string; value: number | undefined | null }[]>([
    { label: m.common_followers(), value: stats.user.followers },
    { label: m.common_following(), value: stats.user.following }
  ]);

  const titleGradient = $derived(() => {
    switch (theme.current.id) {
      case 'cyberpunk':
        return 'linear-gradient(135deg, #fde047, #f472b6)';
      case 'forest':
        return 'linear-gradient(135deg, #bef264, #fbbf24)';
      case 'sunset':
        return 'linear-gradient(135deg, #f97316, #fb7185)';
      case 'ocean':
        return 'linear-gradient(135deg, #22d3ee, #60a5fa)';
      default:
        return 'linear-gradient(135deg, #a5f3fc, #86efac)';
    }
  });
</script>

<div class="summary-container">
  <div class="relative z-30 space-y-4 text-center">
    <div class="avatar-row">
      <img
        src={stats.user.avatarUrl}
        alt={stats.user.login}
        class="avatar {theme.current.border}"
      />
      <div class="name-block">
        <p class="name {theme.current.textPrimary}">{stats.user.name || stats.user.login}</p>
        <p class="handle {theme.current.textMuted}">@{stats.user.login}</p>
      </div>
    </div>

    <div class="pill text-xs tracking-[0.35em] uppercase {theme.current.textMuted} mx-auto w-fit">
      {stats.year} · {m.summary_year_in_review()}
    </div>

    <h2
      class="title-gradient text-4xl leading-tight font-black"
      style={`background-image: ${titleGradient};`}
    >
      {m.summary_title()}
    </h2>

    <p class="mt-1 text-base font-medium {theme.current.textMuted}">
      {m.summary_subtitle()}
    </p>

    <div class="stat-row">
      {#each highlightStats as stat (stat.label)}
        <div class="stat-chip {theme.current.cardBg} {theme.current.border}">
          <span class="label {theme.current.textMuted}">{stat.label}</span>
          <span class="value {theme.current.textPrimary}">{formatValue(stat.value)}</span>
        </div>
      {/each}
    </div>

    <div class="stat-row subtle mt-3">
      {#each socialStats as stat (stat.label)}
        <div class="stat-chip {theme.current.cardBg} {theme.current.border}">
          <span class="label {theme.current.textMuted}">{stat.label}</span>
          <span class="value {theme.current.textPrimary}">{formatValue(stat.value)}</span>
        </div>
      {/each}
    </div>

    <p class="quote text-lg font-semibold {theme.current.textSecondary}">
      {getQuote(stats.totalCommitContributions)}
    </p>
  </div>
</div>

<style>
  .summary-container {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 0 1.75rem;
    overflow: hidden;
  }
  .pill {
    padding: 0.4rem 1rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    letter-spacing: 0.2em;
  }
  .stat-row {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .stat-row.subtle .stat-chip {
    opacity: 0.9;
  }
  .stat-chip {
    min-width: 120px;
    border-radius: 16px;
    padding: 0.7rem 1rem;
    border-width: 1px;
    backdrop-filter: blur(6px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  }
  .stat-chip .label {
    display: block;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .stat-chip .value {
    display: block;
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1.2;
  }
  .quote {
    max-width: 24rem;
    margin: 0 auto;
  }
  .title-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  }
  .avatar-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border-width: 2px;
    object-fit: cover;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }
  .name-block {
    text-align: left;
  }
  .name {
    font-weight: 800;
    font-size: 1.1rem;
    line-height: 1.2;
  }
  .handle {
    font-size: 0.9rem;
  }
</style>
