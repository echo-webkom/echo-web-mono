"use client";

import { hyggkomLikeSubmit } from "@/actions/hyggkom_like_submit";
import { error } from "console";
import { useRouter } from "next/navigation";


type itemProps = {
  id: string,
  name: string,
  userId: string,
  createdAt: Date,
  likesCount: unknown,
}
type hyggkomShoppingListProps = {
  items: Array<itemProps>;
};



export function HyggkomShoppingList({ items }: hyggkomShoppingListProps) {
  const router = useRouter();

  const handleClick = (item: string) => {

    try {
    const response = hyggkomLikeSubmit(item);
    router.refresh();
    } catch {console.log('Error occured')}

    };

  return (
    <div>
      <h3>Like de tingene du mener vi bør kjøpe inn, eller legg til ditt eget forslag!</h3>
      <ul className="list-group capitalize border rounded-lg">
        {items.map((item) => (
          <li className="grid grid-cols-5 py-2 px-2" key={item.id}>
            <p className="col-span-3">{item.name}</p>
            <p className="col-span-1">{item.likesCount as number}</p>
            <button className="col-span-1 border rounded-xl bg-rose-500" onClick={() => handleClick(item.id)}>like</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
