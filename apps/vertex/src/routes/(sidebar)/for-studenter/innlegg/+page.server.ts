import { fetchPosts } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await fetchPosts();

	return {
		posts
	};
};
