import { uno } from '$lib/uno/client.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await uno.content.posts.list();

	return {
		posts
	};
};
