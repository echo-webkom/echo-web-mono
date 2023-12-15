"use server";

import { getColor } from "@/actions/get_color_like_button";

type itemProps = {
    id: string,
    name: string,
    userId: string,
    createdAt: Date,
    likesCount: number,
  }

type hyggkomShoppingListProps = {
    items: Array<itemProps>;
  };

export async function ShoppinList({items}: {items:hyggkomShoppingListProps}) {
    return (
    <ul className="list-group capitalize border rounded-lg">
    {items.map((item) => {
      const color = getColor(item.id)
      console.log(color)
      return (
      <li className="grid grid-cols-5 py-2 px-2" key={item.id}>
        <p className="col-span-3">{item.name}</p>
        <p className="col-span-1">{item.likesCount}</p>
        <button className={`col-span-1 border rounded-xl ${"bg-red-50"}`} onClick={() => handleButtonClick(item.id)}>like</button>
      </li>)
    })}
  </ul>)
}