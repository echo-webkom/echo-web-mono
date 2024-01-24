"use server";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { usersToShoppingListItems } from "@echo-webkom/db/schemas";
import { and, eq } from "drizzle-orm";

export type Item = {
    id: string,
    name: string,
    userId: string,
    createdAt: Date,
    likesCount: number,
  }

export async function getColor(payload: Array<Item>) {
    const user = await auth();

    if (!user) {
        return payload.map((item) => ({
            item,
            isLiked: false
        }))
    }
    const likes = Promise.all(payload.map(async (id) =>
        await checkIfExists(id, user.id))
    );
    return likes
};

async function checkIfExists(item: Item, userId : string) {
    const like = await db
    .select()
    .from(usersToShoppingListItems)
    .where( and (eq (usersToShoppingListItems.itemId, item.id), (eq (usersToShoppingListItems.userId, userId))))

    if (like.length > 0) {
        return {
            item,
            isLiked: true
        }
    } return {
        item,
        isLiked: false
    }
}
