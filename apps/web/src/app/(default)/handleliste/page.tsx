import { eq, sql } from "drizzle-orm";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { shoppingListItems, usersToShoppingListItems } from "@echo-webkom/db/schemas";

import { getColor } from "@/actions/get_color_like_button";
import { Container } from "@/components/container";
import { HyggkomShoppingForm } from "@/components/hyggkom-shopping-form";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";

export default async function HyggkomHandleliste() {
  const user = await auth();

  const items = await db
    .select({
      id: shoppingListItems.id,
      name: shoppingListItems.name,
      userId: shoppingListItems.userId,
      createdAt: shoppingListItems.createdAt,
      likesCount: sql<number>`COUNT(${usersToShoppingListItems.itemId})`,
    })
    .from(shoppingListItems)
    .leftJoin(usersToShoppingListItems, eq(shoppingListItems.id, usersToShoppingListItems.itemId))
    .groupBy(shoppingListItems.id);

  const itemsLiked = await getColor(items);
  itemsLiked.sort((a, b) => b.item.likesCount - a.item.likesCount);

  return (
    <Container className="max-w-5xl ">
      <h1 className="bold py-3 text-4xl">Hyggkoms handleliste</h1>
      <div className="py-5">
        <h1 className="py-3 text-xl">
          Like de tingene du mener vi bør kjøpe inn, eller legg til ditt eget forslag under!
        </h1>
        <HyggkomShoppingList items={itemsLiked} user={user} />
      </div>
      <HyggkomShoppingForm />
    </Container>
  );
}
