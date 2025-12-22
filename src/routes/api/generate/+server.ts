import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGithubStats } from '$lib/server/github';

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const token = data.token;
  const yearStr = data.year;
  const includePrivate = data.includePrivate;
  const ossMinStars = parseInt(data.ossMinStars || '0');
  const ossIncludeOwn = data.ossIncludeOwn;
  const includeForkRepos = data.includeForkRepos ?? false;

  if (!token) {
    return json({ missing: true, message: 'GitHub Token is required' }, { status: 400 });
  }

  const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();

  try {
    const stats = await getGithubStats(token, year, includePrivate, ossMinStars, ossIncludeOwn, includeForkRepos);
    return json({ success: true, stats });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Failed to fetch GitHub stats';
    const bodyMessage =
      typeof err === 'object' && err !== null && 'body' in err
        ? (err as { body?: { message?: string } }).body?.message
        : undefined;

    return json(
      {
        error: true,
        message: bodyMessage || message
      },
      { status: 500 }
    );
  }
};
