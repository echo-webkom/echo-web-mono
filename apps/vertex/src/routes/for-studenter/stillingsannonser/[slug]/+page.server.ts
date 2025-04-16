import { fetchJobs } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	const jobs = await fetchJobs();
	const job = jobs.find((job) => job.slug === params.slug);
	if (!job) {
		error(404, 'Finner ikke stillingsannonsen');
	}

	return {
		job: {
			...job,
			body: await marked(job.body)
		}
	};
};
