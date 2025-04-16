import { axis } from '$lib/axis/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const minutes = await axis.fetchMinutes();
	return {
		minutes
	};
};
