import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchPosts } from '$lib/sanity/queries';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	const posts = await fetchPosts();
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
