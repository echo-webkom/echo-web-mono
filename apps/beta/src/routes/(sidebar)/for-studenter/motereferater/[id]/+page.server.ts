import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { uno } from '$lib/uno/client.server';

export const load: PageServerLoad = async ({ params }) => {
	const minute = await uno.content.minutes.list().then((data) => {
		return data.find((minute) => minute._id === params.id);
	});
	if (!minute) {
		error(404, 'Møtereferat ikke funnet');
	}

	return {
		minute
	};
};
