import type { PageType, StudentGroupType } from '@echo-webkom/lib';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { axis } from './axis/client';

export const loadStaticPage = async (pageType: PageType, slug: string) => {
	const page = await axis.fetchStaticPage(pageType, slug);
	if (!page) {
		error(404, 'Finner ikke siden du leter etter');
	}
	return {
		...page,
		body: await marked(page.body)
	};
};

export const loadGroupsPage = async (groupType: StudentGroupType) => {
	const groups = await axis.fetchGroupsByType(groupType);
	if (!groups) {
		error(404, 'Finner ikke siden du leter etter');
	}
	return groups;
};
