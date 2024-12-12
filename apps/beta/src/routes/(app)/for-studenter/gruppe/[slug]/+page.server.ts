import { fetchGroupBySlug } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { urlFor } from '@echo-webkom/sanity';

export const load: PageServerLoad = async ({ params }) => {
	const group = await fetchGroupBySlug(params.slug);

	if (!group) {
		throw error(404, 'Finner ikke gruppe');
	}

	const photo = group.image ? urlFor(group.image).url() : null;

	return {
		content: await marked(group.description ?? ''),
		photo,
		group
	};
};
