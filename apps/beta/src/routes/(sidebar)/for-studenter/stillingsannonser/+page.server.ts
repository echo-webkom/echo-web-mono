import { axis } from '$lib/axis/client.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const jobs = await axis.content.jobs.list();

	return {
		jobs
	};
};
