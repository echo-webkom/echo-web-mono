import { uno } from '$lib/uno/client.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const merch = await uno.content.merch.list();

	return {
		merch
	};
};
