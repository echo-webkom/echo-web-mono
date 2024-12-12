import { fetchGroupsByType } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import removeMd from 'remove-markdown';

export const load: PageServerLoad = async ({ params }) => {
	const groups = await fetchGroupsByType(params.type).then((groups) => {
		return groups
			.map((group) => ({
				...group,
				description: removeMd(group.description || '')
			}))
			.sort((a, b) => {
				if (params.type === 'hovedstyre') {
					return b.name.localeCompare(a.name);
				}
				return a.name.localeCompare(b.name);
			});
	});

	if (groups.length === 0) {
		throw error(404, 'Finner ikke grupper');
	}

	return {
		groups
	};
};
