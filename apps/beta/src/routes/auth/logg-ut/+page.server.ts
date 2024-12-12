import type { Actions } from './$types';
import { invalidateSession, sessionCookieName } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.user || !locals.session) {
			return { message: 'Du er ikke logget inn' };
		}

		await invalidateSession(locals.session.sessionToken);
		cookies.delete(sessionCookieName, {
			path: '/'
		});

		return { message: 'Du er logget ut' };
	}
};
