import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { axis } from '$lib/axis/client.server';

export const load: PageServerLoad = async ({ params }) => {
	const posts = await axis.content.posts.list();
	const post = posts.find((post) => post.slug === params.slug);
	if (!post) {
		error(404, 'Post not found');
	}
	return {
		post: {
			...post,
			body: await marked(post.body)
		}
	};
};
