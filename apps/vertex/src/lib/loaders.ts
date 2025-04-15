import type { PageType } from '@echo-webkom/lib';
import { fetchStaticPage } from './sanity/queries';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';

export const loadStaticPage = async (pageType: PageType, slug: string) => {
	const page = await fetchStaticPage(pageType, slug);
	if (!page) {
		error(404, 'Finner ikke siden du leter etter');
	}
	return {
		...page,
		body: await marked(page.body)
	};
};
