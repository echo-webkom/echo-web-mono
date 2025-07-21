import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { uno } from '$lib/uno/client.server';
import { isEmail } from '$lib/email';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const email = (formData.get('email') as string | null) || undefined;
		const name = (formData.get('name') as string | null) || undefined;
		const message = (formData.get('message') as string | null) || undefined;

		if (!message) {
			return fail(400, {
				message: 'En tilbakmelding er påkrevd.'
			});
		}

		if (message.length < 5) {
			return fail(400, {
				message: 'Tilbakemeldingen må være lengre enn 4 bokstaver.'
			});
		}

		if (email && !isEmail(email)) {
			return fail(400, {
				message: 'E-posten må være en gyldig e-post.'
			});
		}

		const success = await uno.feedback.create({
			email,
			name,
			message
		});

		if (!success) {
			console.log('Internal error');

			return fail(500, {
				message: 'Noe gikk galt på serveren.'
			});
		}

		return {
			message: 'Takk for din tilbakemelding!'
		};
	}
};
