"use client";

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

const heart = "<3"

export function HyggkomShoppingList({ items }: hyggkomShoppingListProps) {
  return (
    <div>
      <h3>Like de tingene du mener vi bør kjøpe inn, eller legg til ditt eget forslag!</h3>
      <ul className="list-group capitalize border rounded-lg">
        {items.map((item) => (
          <li className="grid grid-cols-5 py-2 px-2" key={item.id}>
            <p className="col-span-3">{item.name}</p>
            <p className="col-span-1">{item.likesCount as number}</p>
            <button className="col-span-1 border rounded-xl bg-rose-500">{heart}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
