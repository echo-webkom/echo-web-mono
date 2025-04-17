import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { SESSION_COOKIE_NAME } from '$lib/auth/constants';
import { db } from '$lib/db/client.server';
import { sessions } from '@echo-webkom/db/schemas';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		if (!locals.session) {
			return fail(400, {
				message: 'Fant ingen session.'
			});
		}

		await db.delete(sessions).where(eq(sessions.sessionToken, locals.session.sessionToken));

		cookies.delete(SESSION_COOKIE_NAME, {
			path: '/'
		});

		locals.user = null;
		locals.session = null;

		redirect(302, '/');
	}
};
