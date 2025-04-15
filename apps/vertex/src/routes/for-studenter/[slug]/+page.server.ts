import { loadStaticPage } from '$lib/loaders';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const page = await loadStaticPage('for-students', slug);
	return {
		page
	};
};
