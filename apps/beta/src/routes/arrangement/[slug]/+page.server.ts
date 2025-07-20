import { uno } from '$lib/uno/client.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	const event = await uno.events.getBySlug(params.slug);

	if (!event) {
		error(404, 'Finner ikke arrangmentet');
	}

	const registrationCount = await uno.events.registrations(event._id);

	return {
		event: {
			...event,
			body: await marked(event.body ?? '')
		},
		registrationCount
	};
};
