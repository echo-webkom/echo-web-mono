import { fetchJobs } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const jobs = await fetchJobs();

	return {
		jobs
	};
};
