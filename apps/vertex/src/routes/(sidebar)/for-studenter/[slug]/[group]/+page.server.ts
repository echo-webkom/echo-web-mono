import { GROUP_PATH_TO_TYPE } from '@echo-webkom/lib';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchGroupBySlug } from '$lib/sanity/queries';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	const { slug, group } = params;

	const isGroupPage = !!GROUP_PATH_TO_TYPE[slug];
	if (!isGroupPage) {
		error(404, 'Group not found');
	}

	const studentGroup = await fetchGroupBySlug(group);
	if (!studentGroup) {
		throw error(404, 'Group not found');
	}

	const isCorrectType = GROUP_PATH_TO_TYPE[slug] === studentGroup.groupType;
	if (!isCorrectType) {
		throw error(404, 'Group not found');
	}

	return {
		group: {
			...studentGroup,
			description: studentGroup.description ? await marked(studentGroup.description) : null
		}
	};
};
