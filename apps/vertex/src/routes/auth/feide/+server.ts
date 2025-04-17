import { generateState } from 'arctic';
import type { RequestHandler } from './$types';
import { feide } from '$lib/auth';

export const GET: RequestHandler = ({ cookies }) => {
	const state = generateState();
	const url = feide.createAuthorizationURL(state);

	console.log('state', state);
	console.log('url', url);

	cookies.set('feide_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
