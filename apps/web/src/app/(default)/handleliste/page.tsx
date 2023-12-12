import { db } from "@echo-webkom/db";
import { eq, sql } from "drizzle-orm";
import { Container } from "@/components/container";
import { HyggkomShoppingForm } from "@/components/hyggkom-shopping-form";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";
import { shoppingListItems, shoppingListLikes } from "@echo-webkom/db/schemas";

export default async function HyggkomHandleliste() {
  const items = await db
  .select({
    id: shoppingListItems.id,
    name: shoppingListItems.name,
    userId: shoppingListItems.userId,
    createdAt: shoppingListItems.createdAt,
    likesCount:
  sql`COUNT(${shoppingListLikes.item})`,
  })
  .from(shoppingListItems)
  .leftJoin(
    shoppingListLikes,
    eq(shoppingListItems.id, shoppingListLikes.item)
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
