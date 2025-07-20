import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';
import { uno } from '$lib/uno/client.server';

export const load: PageServerLoad = async ({ params }) => {
	const job = await uno.content.jobs
		.list()
		.then((jobs) => jobs.find((job) => job.slug === params.slug));
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
