import { SESSION_COOKIE_NAME } from '$lib/auth';
import { axis } from '$lib/axis/client';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return await resolve(event);
	}

	const { user, session } = await axis.auth.session.validate(sessionId);
	if (session) {
		event.cookies.set(SESSION_COOKIE_NAME, sessionId, {
			expires: new Date(session.expiresAt)
		});
		event.locals.user = user;
		event.locals.session = session;
	} else {
		event.cookies.delete(SESSION_COOKIE_NAME);
		event.locals.user = null;
		event.locals.session = null;
	}

	return await resolve(event);
};
