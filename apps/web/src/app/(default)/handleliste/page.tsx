import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { HyggkomShoppingForm } from "@/components/hyggkom-shopping-form";
import { HyggkomShoppingList } from "@/components/hyggkom-shopping-list";

export default async function HyggkomHandleliste() {
  const items = await db.query.shoppingListItems.findMany();
  return (
    <Container className="max-w-xl">
      <HyggkomShoppingList items={items} />
      <HyggkomShoppingForm />
    </Container>
  );
}
