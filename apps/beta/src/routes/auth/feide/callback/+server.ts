import { feide } from '$lib/server/feide';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { createSession, sessionCookieName } from '$lib/server/auth';
import { dev } from '$app/environment';
import { accounts, users } from '@echo-webkom/db/schemas';
import { nanoid } from 'nanoid';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('feide_state');

	if (code === null || storedState === null || state !== storedState) {
		return new Response('Invalid state', { status: 400 });
	}

	cookies.delete('feide_state', {
		path: '/'
	});

	const tokens = await feide.validateAuthorizationCode(code);
	const feideUser = await feide.getUser(tokens.accessToken());
	const existingUser = await db.query.accounts.findFirst({
		where: (row, { eq, and }) =>
			and(eq(row.providerAccountId, feideUser.sub), eq(row.provider, 'feide')),
		with: {
			user: true
		}
	});

	if (existingUser !== undefined) {
		const session = await createSession(existingUser.user.id);

		cookies.set(sessionCookieName, session.sessionToken, {
			path: '/',
			secure: !dev,
			httpOnly: true,
			expires: session.expires
		});

		throw redirect(307, '/');
	}

	const userId = nanoid();
	await db.insert(users).values({
		email: feideUser.email,
		name: feideUser.name,
		id: userId
	});

	await db.insert(accounts).values({
		provider: 'feide',
		providerAccountId: feideUser.sub,
		userId: userId,
		type: 'oauth',
		expires_at: tokens.accessTokenExpiresAt().getTime(),
		access_token: tokens.accessToken(),
		id_token: tokens.idToken(),
		refresh_token: tokens.refreshToken(),
		scope: tokens.scopes().join(' '),
		token_type: 'Bearer'
	});

	const session = await createSession(userId);

	cookies.set(sessionCookieName, session.sessionToken, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		expires: session.expires
	});

	throw redirect(307, '/');
};
