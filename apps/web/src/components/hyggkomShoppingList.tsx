import { Button } from "./ui/button";

interface Props {
  items: Array<string>;
}

export function ShoppingList({ items }: Props) {
  return (
    <>
      <h1 className=" text-3xl font-bold text-pink-600 underline">
        Hyggkoms handleliste til lesesalen:
      </h1>
      <h3>Like de tingene du mener vi bør kjøpe inn, eller legg til ditt eget forslag!</h3>
      <ul className="list-group capitalize">
        {items.map((item) => (
          <li className="" key={item}>
            {item}
            <Button>Like</Button>
          </li>
        ))}
      </ul>
    </>
  );
}
