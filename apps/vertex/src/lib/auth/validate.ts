import { db } from '$lib/db/client.server';
import type { Session } from '@echo-webkom/db/schemas';

export type ValidatedUser = {
	id: string;
	name: string | null;
	email: string;
	image: string | null;
	alternativeEmail: string | null;
	degree: string | null;
	year: number | null;
	memberships: Array<{ group: string; isLeader: boolean }>;
	birthday: Date | null;
};

export type ValidatedSession = Session;

export const validateSession = async (
	sessionId: string
): Promise<
	| {
			user: ValidatedUser;
			session: ValidatedSession;
	  }
	| {
			user: null;
			session: null;
	  }
> => {
	const session = await db.query.sessions.findFirst({
		where: (row, { eq }) => eq(row.sessionToken, sessionId)
	});

	if (!session) {
		return { user: null, session: null };
	}

	const user = await db.query.users.findFirst({
		where: (row, { eq }) => eq(row.id, session.userId)
	});

	if (!user) {
		return { user: null, session: null };
	}

	const memberships = await db.query.usersToGroups
		.findMany({
			where: (row, { eq }) => eq(row.userId, user.id)
		})
		.then((memberships) =>
			memberships.map((membership) => ({
				group: membership.groupId,
				isLeader: membership.isLeader
			}))
		);

	const degree = user.degreeId
		? await db.query.degrees
				.findFirst({
					where: (row, { eq }) => eq(row.id, user.degreeId!)
				})
				.then((degree) => degree?.name ?? null)
		: null;

	const validatedUser: ValidatedUser = {
		id: user.id,
		name: user.name,
		email: user.email,
		image: user.image,
		alternativeEmail: user.alternativeEmail,
		degree,
		year: user.year,
		memberships,
		birthday: user.birthday
	};

	return {
		user: validatedUser,
		session
	};
};
