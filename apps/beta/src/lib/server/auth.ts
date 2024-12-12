import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { sessions, type Session } from '@echo-webkom/db/schemas';
import { nanoid } from 'nanoid';

export type SessionValidationResult = Awaited<ReturnType<typeof validateSession>>;

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export async function createSession(userId: string): Promise<Session> {
	const sessionId = nanoid(32);
	const session: Session = {
		sessionToken: sessionId,
		userId,
		expires: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(sessions).values(session);
	return session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.sessionToken, sessionId));
}

export async function validateSession(sessionId: string) {
	const result = await db.query.sessions.findFirst({
		where: (row, { eq }) => eq(row.sessionToken, sessionId),
		with: {
			user: {
				with: {
					memberships: true
				}
			}
		}
	});

	if (!result) {
		return { session: null, user: null };
	}

	const session: Session = {
		sessionToken: result.sessionToken,
		expires: result.expires,
		userId: result.userId
	};

	const { user } = result;

	const sessionExpired = Date.now() >= session.expires.getTime();
	if (sessionExpired) {
		await db.delete(sessions).where(eq(sessions.sessionToken, session.sessionToken));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expires.getTime() - DAY_IN_MS * 15;

	if (renewSession) {
		session.expires = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(sessions)
			.set({ expires: session.expires })
			.where(eq(sessions.sessionToken, session.sessionToken));
	}

	return { session, user };
}
