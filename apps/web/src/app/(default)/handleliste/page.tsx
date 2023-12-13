import { db } from "@echo-webkom/db";
import { eq, sql } from "drizzle-orm";
import { Container } from "@/components/container";
import { HyggkomShoppingForm } from "@/components/hyggkom-shopping-form";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";
import { shoppingListItems, usersToShoppingListItems } from "@echo-webkom/db/schemas";

export default async function HyggkomHandleliste() {
  const items = await db
  .select({
    id: shoppingListItems.id,
    name: shoppingListItems.name,
    userId: shoppingListItems.userId,
    createdAt: shoppingListItems.createdAt,
    likesCount:
  sql`COUNT(${usersToShoppingListItems.itemId})`,
  })
  .from(shoppingListItems)
  .leftJoin(
    usersToShoppingListItems,
    eq(shoppingListItems.id, usersToShoppingListItems.itemId)
  )
  .groupBy(shoppingListItems.id);

  return (
    <Container className="max-w-5xl">
      <h1 className="text-4xl bold py-3">Hyggkoms handleliste</h1>
      <HyggkomShoppingList items={items} />
      <HyggkomShoppingForm></HyggkomShoppingForm>
    </Container>
  );
}
