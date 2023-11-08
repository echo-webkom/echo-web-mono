"use client";

import { type ShoppingList } from "@echo-webkom/db/schemas";

type hyggkomShoppingListProps = {
  items: Array<ShoppingList>;
};

export function HyggkomShoppingList({ items }: hyggkomShoppingListProps) {
  return (
    <div>
      <h3>Like de tingene du mener vi bør kjøpe inn, eller legg til ditt eget forslag!</h3>
      <ul className="list-group capitalize">
        {items.map((item) => (
          <li className="" key={item.id}>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
