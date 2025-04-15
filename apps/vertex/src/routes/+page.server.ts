import { fetchUpcomingEvents, fetchUpcomingBedpres } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [events, bedpres] = await Promise.all([fetchUpcomingEvents(), fetchUpcomingBedpres()]);

	return {
		events,
		bedpres
	};
};
