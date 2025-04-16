import { axis } from '$lib/axis/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [events, bedpres] = await Promise.all([
		axis.fetchUpcomingEvents(),
		axis.fetchUpcomingBedpres()
	]);

	return {
		events,
		bedpres
	};
};
