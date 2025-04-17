import { axis } from '$lib/axis/client.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [events, bedpres] = await Promise.all([
		axis.events.upcoming(['event', 'external'], 5),
		axis.events.upcoming(['bedpres'], 5)
	]);

	return {
		events,
		bedpres
	};
};
