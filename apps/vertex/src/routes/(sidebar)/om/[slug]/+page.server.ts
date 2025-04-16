import { loadStaticPage } from '$lib/loaders';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const page = await loadStaticPage('about', slug);
	return {
		page
	};
};
