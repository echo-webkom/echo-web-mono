import { uno } from '$lib/uno/client.server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/hjem');
	}

	const [events, bedpres] = await Promise.all([
		uno.events.upcoming(['event', 'external'], 5),
		uno.events.upcoming(['bedpres'], 5)
	]);

	return {
		events,
		bedpres
	};
};
