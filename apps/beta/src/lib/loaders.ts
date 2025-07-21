import type { PageType, StudentGroupType } from '@echo-webkom/lib';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { uno } from './uno/client.server';

export const loadStaticPage = async (pageType: PageType, slug: string) => {
	const page = await uno.content.staticPage(pageType, slug);
	if (!page) {
		error(404, 'Finner ikke siden du leter etter');
	}
	return {
		...page,
		body: await marked(page.body)
	};
};

export const loadGroupsPage = async (groupType: StudentGroupType) => {
	const groups = await uno.groups.byType(groupType);
	if (!groups) {
		error(404, 'Finner ikke siden du leter etter');
	}
	return groups;
};
