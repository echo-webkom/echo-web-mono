"use client";

import { hyggkomLikeSubmit } from "@/actions/hyggkom_like_submit";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


type itemProps = {
  id: string,
  name: string,
  userId: string,
  createdAt: Date,
  likesCount: number,
}

type hyggkomShoppingListProps = {
  items: Array<itemProps>;
  colors: Array<boolean>;
};



export function HyggkomShoppingList({ items, colors }: hyggkomShoppingListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleButtonClick = (item: string) => {
    handleClick(item).catch((error) => {
      console.error("Error:", error);
    });
  };

  const handleClick = async (item: string) => {
    const response = await hyggkomLikeSubmit(item);

    if (response) {
      toast({
        title: "Takk for din tilbakemelding!",
        description: "Forslaget ble liket.",
        variant: "success",
      });

      router.refresh();
    } else {
      toast({
        title: "Takk for din tilbakemelding!",
        description: "Din like er blitt fjernet.",
        variant: "warning",
      });

      router.refresh();
    }
  };


  return (
    <div>
      <h3>Like de tingene du mener vi bør kjøpe inn, eller legg til ditt eget forslag!</h3>
      <ul className="list-group capitalize border rounded-lg">
        {items.map((item, index) => {
          return (
          <li className="grid grid-cols-5 py-2 px-2" key={item.id}>
            <p className="col-span-3">{item.name}</p>
            <p className="col-span-1">{item.likesCount}</p>
            <button className={`col-span-1 border rounded-xl ${colors[index]? "bg-black" : "bg-white"}`} onClick={() => handleButtonClick(item.id)}>like</button>
          </li>)
        })}
      </ul>
    </div>
  );
}
