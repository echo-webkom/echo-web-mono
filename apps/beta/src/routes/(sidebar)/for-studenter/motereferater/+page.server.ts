import { uno } from '$lib/uno/client.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const minutes = await uno.content.minutes.list();
	return {
		minutes
	};
};
