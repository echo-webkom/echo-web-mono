import { axis } from '$lib/axis/client.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const items = await axis.shoppingList.list();

	return {
		items
	};
};
