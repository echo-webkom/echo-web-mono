import { fetchMinutes } from '$lib/server/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const minutes = await fetchMinutes();

	return {
		minutes
	};
};
