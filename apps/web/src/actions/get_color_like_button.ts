"use server";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { shoppingListItems, usersToShoppingListItems } from "@echo-webkom/db/schemas";
import { and, eq } from "drizzle-orm";

export async function getColor(payload: Array<string>) {
    const user = await getAuth();

    if (!user) {
        return {
            success: false,
            message: "Du er ikke logget inn",
          };
    }
    const likes = payload.map(async (id) =>
        await checkIfExists(id, user.id)
    );
    return likes
};

async function checkIfExists(id: string, userId : string) {
    const like = await db
    .select({id: shoppingListItems.id})
    .from(usersToShoppingListItems)
    .where( and (eq (usersToShoppingListItems.itemId, id), (eq (usersToShoppingListItems.userId, userId))))

    if (like.length > 0) {
        return true
    } return false
}
