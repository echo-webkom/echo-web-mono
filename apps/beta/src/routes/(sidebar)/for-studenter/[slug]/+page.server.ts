import { loadGroupsPage, loadStaticPage } from '$lib/loaders';
import { GROUP_PATH_TO_TYPE } from '@echo-webkom/lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;

	const groupType = GROUP_PATH_TO_TYPE[slug];
	const isGroupPage = !!groupType;

	if (isGroupPage) {
		const groups = await loadGroupsPage(groupType);
		if (groupType === 'board') {
			groups.reverse();
		}
		return {
			isGroupPage,
			groups
		};
	}

	const page = await loadStaticPage('for-students', slug);
	return {
		page
	};
};
