import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	if (!dev) {
		throw new Error('This route is only available in development mode.');
	}
};
