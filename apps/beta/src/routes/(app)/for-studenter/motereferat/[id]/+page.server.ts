import { fetchMinutes } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const minute = await fetchMinutes().then((minutes) =>
		minutes.find((minute) => minute._id === params.id)
	);

	if (!minute) {
		throw error(404, 'Finner ikke møtereferat');
	}

	return {
		minute
	};
};
