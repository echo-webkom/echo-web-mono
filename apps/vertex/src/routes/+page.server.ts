import { axis } from '$lib/axis/client.server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/hjem');
	}

	const [events, bedpres] = await Promise.all([
		axis.events.upcoming(['event', 'external'], 5),
		axis.events.upcoming(['bedpres'], 5)
	]);

	return {
		events,
		bedpres
	};
};
