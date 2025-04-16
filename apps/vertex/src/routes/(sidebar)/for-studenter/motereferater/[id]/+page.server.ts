import { fetchMinutes } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const minute = await fetchMinutes().then((data) => {
		return data.find((minute) => minute._id === params.id);
	});
	if (!minute) {
		error(404, 'Møtereferat ikke funnet');
	}

	return {
		minute
	};
};
