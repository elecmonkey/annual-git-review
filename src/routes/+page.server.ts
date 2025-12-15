import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getGithubStats } from '$lib/server/github';

export const actions = {
  default: async ({ request }: { request: Request }) => {
    const data = await request.formData();
    const token = data.get('token')?.toString();
    const yearStr = data.get('year')?.toString();
    const includePrivate = data.get('includePrivate') === 'on';

    if (!token) {
      return fail(400, { missing: true, message: 'GitHub Token is required' });
    }

    const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();

    try {
      const stats = await getGithubStats(token, year, includePrivate);
      return { success: true, stats };
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to fetch GitHub stats';
      const bodyMessage =
        typeof err === 'object' && err !== null && 'body' in err
          ? (err as { body?: { message?: string } }).body?.message
          : undefined;

      return fail(500, {
        error: true,
        message: bodyMessage || message
      });
    }
  }
} satisfies Actions;
