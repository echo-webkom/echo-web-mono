import { fetchMinutes } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const minutes = await fetchMinutes();
	return {
		minutes
	};
};
