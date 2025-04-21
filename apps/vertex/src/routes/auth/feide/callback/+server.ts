import { feide } from '$lib/auth';
import type { FeideUserInfo } from '$lib/auth/feide';
import { isMemberOfecho } from '$lib/auth/is-member-of-echo';
import { db } from '$lib/db/client.server';
import { toRelative } from '$lib/url';
import { accounts, kv, sessions, users } from '@echo-webkom/db/schemas';
import { nanoid } from 'nanoid';
import type { RequestHandler } from '@sveltejs/kit';
import { addDays, addMinutes, isFuture } from 'date-fns';
import { SESSION_COOKIE_NAME } from '$lib/auth/constants';

const isAllowedToSignIn = async (
	userInfo: FeideUserInfo,
	accessToken: string
): Promise<boolean | string> => {
	const { success, error } = await isMemberOfecho(accessToken);

	if (success) {
		return true;
	}

	const email = userInfo.email?.toLowerCase();
	if (!email) {
		// This should never happen
		console.error('No email in profile', userInfo);
		return false;
	}

	const whitelistEntry = await db.query.whitelist.findFirst({
		where: (whitelist, { eq }) => eq(whitelist.email, email)
	});

	if (whitelistEntry && isFuture(whitelistEntry.expiresAt)) {
		return true;
	}

	console.info(
		JSON.stringify({
			message: 'Failed login attempt',
			email,
			error
		})
	);

	const id = nanoid();
	await db.insert(kv).values({
		key: `sign-in-attempt:${id}`,
		value: JSON.stringify({
			email,
			error
		}),
		ttl: addMinutes(new Date(), 5)
	});

	const url = new URL('https://abakus.no');
	url.pathname = '/logg-inn';
	url.searchParams.append('attemptId', id);

	return toRelative(url);
};

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('feide_oauth_state') ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/logg-inn?error=missing_code_or_state'
			}
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/logg-inn?error=invalid_state'
			}
		});
	}

	const tokens = await feide.validateAuthorizationCode(code);

	const userInfo = await feide.getUserInfo(tokens.accessToken());
	const allowedToSignIn = await isAllowedToSignIn(userInfo, tokens.accessToken());
	if (typeof allowedToSignIn === 'string') {
		console.log('Redirecting to', allowedToSignIn);

		return new Response(null, {
			status: 302,
			headers: {
				Location: allowedToSignIn
			}
		});
	}

	if (allowedToSignIn === false) {
		return new Response(null, {
			status: 403
		});
	}

	const existingAccount = await db.query.accounts.findFirst({
		where: (row, { eq, and }) =>
			and(eq(row.provider, 'feide'), eq(row.providerAccountId, userInfo.sub))
	});

	console.log('Existing account', existingAccount);

	if (!existingAccount) {
		const userId = nanoid();

		await db.insert(users).values({
			email: userInfo.email,
			name: userInfo.name,
			id: userId
		});

		await db.insert(accounts).values({
			userId,
			type: 'oauth' as const,
			provider: 'feide',
			providerAccountId: userInfo.sub,
			refresh_token: null,
			access_token: tokens.accessToken(),
			expires_at: tokens.accessTokenExpiresInSeconds(),
			token_type: 'Bearer',
			scope: tokens.scopes().join(' '),
			id_token: tokens.idToken(),
			session_state: null
		});

		const sessionToken = nanoid(40);
		const expiresAt = addDays(new Date(), 30);

		await db.insert(sessions).values({
			sessionToken,
			userId,
			expires: expiresAt
		});

		cookies.set(SESSION_COOKIE_NAME, sessionToken, {
			path: '/',
			expires: expiresAt
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} else {
		let existingSession = await db.query.sessions.findFirst({
			where: (row, { eq, and, lt }) =>
				and(eq(row.userId, existingAccount.userId), lt(row.expires, new Date()))
		});

		if (!existingSession) {
			const sessionId = nanoid(40);
			const expiresAt = addDays(new Date(), 30);
			await db.insert(sessions).values({
				sessionToken: sessionId,
				userId: existingAccount.userId,
				expires: expiresAt
			});
			existingSession = {
				sessionToken: sessionId,
				expires: expiresAt,
				userId: existingAccount.userId
			};
		}

		cookies.set(SESSION_COOKIE_NAME, existingSession.sessionToken, {
			path: '/',
			expires: existingSession.expires
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}
};
