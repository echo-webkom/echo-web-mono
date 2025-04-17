import { SESSION_COOKIE_NAME } from '$lib/auth/constants';
import { validateSession } from '$lib/auth/validate';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return await resolve(event);
	}

	const { user, session } = await validateSession(sessionId);
	if (session) {
		event.cookies.set(SESSION_COOKIE_NAME, sessionId, {
			expires: new Date(session.expires),
			path: '/'
		});
		event.locals.user = user;
		event.locals.session = session;
	} else {
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		event.locals.user = null;
		event.locals.session = null;
	}

	return await resolve(event);
};
