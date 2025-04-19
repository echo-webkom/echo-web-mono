import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db/client.server';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/logg-inn');
	}
	const groupId = params.id;

	const group = await db.query.groups.findFirst({
		where: (row, { eq }) => eq(row.id, groupId),
		with: {
			members: true
		}
	});

	if (!group) {
		error(404, 'Finner ikke gruppen');
	}

	const isMember = group.members.some((member) => member.userId === user.id);
	if (!isMember) {
		error(403, 'Ikke medlem av gruppen');
	}

	const members = await db.query.usersToGroups.findMany({
		where: (row, { eq }) => eq(row.groupId, groupId),
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					email: true,
					image: true
				}
			}
		}
	});

	return {
		group,
		members
	};
};
