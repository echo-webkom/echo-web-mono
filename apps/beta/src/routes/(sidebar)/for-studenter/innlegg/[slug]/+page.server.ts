import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { uno } from '$lib/uno/client.server';

export const load: PageServerLoad = async ({ params }) => {
	const posts = await uno.content.posts.list();
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
