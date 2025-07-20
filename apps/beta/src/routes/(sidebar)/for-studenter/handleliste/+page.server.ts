import { axis } from '$lib/axis/client.server';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db/client.server';
import { shoppingListItems, usersToShoppingListItems } from '@echo-webkom/db/schemas';
import { ShoppingListService } from '$lib/services/shopping-list-service';

export const load: PageServerLoad = async () => {
	const items = await axis.shoppingList.list();

	return {
		items
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const user = locals.user;

		if (!user) {
			return fail(401, {
				message: 'Du må være logget inn.'
			});
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString();

		if (!name) {
			return fail(400, {
				message: 'Du må legge til hva du ønsker.'
			});
		}

		const item = await db
			.insert(shoppingListItems)
			.values({
				name,
				userId: user.id
			})
			.returning()
			.then((res) => res[0]);

		if (!item) {
			return fail(500, {
				message: 'Noe gikk galt når vi prøvde å opprette handlelisten.'
			});
		}

		await db.insert(usersToShoppingListItems).values({
			userId: user.id,
			itemId: item.id
		});

		return {
			success: true,
			message: 'Handlelisten ble opprettet.'
		};
	},
	like: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			return fail(401, {
				message: 'Du er ikke logget inn.'
			});
		}

		const formData = await request.formData();
		const itemId = formData.get('id')?.toString();

		if (!itemId) {
			return fail(401, {
				message: 'Mangler id.'
			});
		}

		ShoppingListService.like(itemId, user.id);

		return { success: true };
	}
};
