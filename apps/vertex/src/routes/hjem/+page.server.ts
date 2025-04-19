import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { axis } from '$lib/axis/client.server';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/');
	}

	const [allEvents, events, bedpres, p] = await Promise.all([
		axis.events.list(),
		axis.events.upcoming(['event', 'external'], 8),
		axis.events.upcoming(['bedpres'], 4),
		axis.content.posts.list()
	]);

	const posts = p
		.toSorted((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())
		.slice(0, 2);

	return {
		allEvents,
		events,
		bedpres,
		posts
	};
};
