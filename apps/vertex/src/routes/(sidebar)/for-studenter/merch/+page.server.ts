import { axis } from '$lib/axis/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const merch = await axis.content.merch.list();

	return {
		merch
	};
};
