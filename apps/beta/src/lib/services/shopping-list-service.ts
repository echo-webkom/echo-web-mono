import { db } from '$lib/db/client.server';
import { usersToShoppingListItems } from '@echo-webkom/db/schemas';
import { and, eq } from 'drizzle-orm';

export class ShoppingListService {
	static async like(itemId: string, userId: string) {
		const hasLiked = await db.query.usersToShoppingListItems
			.findFirst({
				where: (row, { and, eq }) => and(eq(row.userId, userId), eq(row.itemId, itemId))
			})
			.then((res) => !!res);

		if (hasLiked) {
			await db
				.delete(usersToShoppingListItems)
				.where(
					and(
						eq(usersToShoppingListItems.userId, userId),
						eq(usersToShoppingListItems.itemId, itemId)
					)
				);
		} else {
			await db.insert(usersToShoppingListItems).values({ userId, itemId });
		}

		return true;
	}
}
