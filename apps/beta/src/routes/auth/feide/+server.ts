import { dev } from '$app/environment';
import { feide } from '$lib/server/feide';
import type { RequestHandler } from '@sveltejs/kit';
import { generateState } from 'arctic';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateState();
	const url = feide.createAuthorizationUrl(state);

	cookies.set('feide_state', state, {
		maxAge: 60 * 60,
		path: '/',
		secure: !dev,
		httpOnly: true
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
