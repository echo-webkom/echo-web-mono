import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { axis } from '$lib/axis/client.server';

export const load: PageServerLoad = async ({ params }) => {
	const minute = await axis.content.minutes.list().then((data) => {
		return data.find((minute) => minute._id === params.id);
	});
	if (!minute) {
		error(404, 'Møtereferat ikke funnet');
	}

	return {
		minute
	};
};
