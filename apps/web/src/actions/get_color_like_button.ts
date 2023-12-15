"use server";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { shoppingListItems } from "@echo-webkom/db/schemas";
import { and, eq } from "drizzle-orm";

export async function getColor(payload: string) {
    const user = await getAuth();

    if (!user) {
        return "bg-white"
    }
    else {
        const like = await db
        .select({id: shoppingListItems.id})
        .from(shoppingListItems)
        .where(and (eq (shoppingListItems.id, payload), eq (shoppingListItems.userId, user.id)))
        if (!like) {return "bg-white"}
        else {return "bg-black"}
    }
};
