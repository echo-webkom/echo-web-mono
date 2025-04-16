import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { axis } from '$lib/axis/client';

export const load: PageServerLoad = async ({ params }) => {
	const jobs = await axis.fetchJobs();
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
