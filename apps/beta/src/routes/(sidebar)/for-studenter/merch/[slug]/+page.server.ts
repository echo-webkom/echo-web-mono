import { uno } from '$lib/uno/client.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const merch = await uno.content.merch
		.list()
		.then((m) => m.find((merch) => merch.slug === params.slug));

	if (!merch) {
		error(404, 'Merch not found');
	}

	return {
		merch
	};
};
