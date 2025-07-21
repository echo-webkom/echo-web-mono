import { uno } from '$lib/uno/client.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const jobs = await uno.content.jobs.list();

	return {
		jobs
	};
};
