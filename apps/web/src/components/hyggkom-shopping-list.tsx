"use client";

import { type Item } from "@/actions/get_color_like_button";
import { hyggkomLikeSubmit } from "@/actions/hyggkom_like_submit";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


type itemProps = {
  item: Item,
  isLiked: boolean
}

type hyggkomShoppingListProps = {
  items: Array<itemProps>;
};



export function HyggkomShoppingList({ items }: hyggkomShoppingListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleButtonClick = (item: string) => {
    handleClick(item).catch((error) => {
      toast({
        title: "Noe gikk galt",
        description: `Error: ${error}`,
        variant: "destructive",
      });

      router.refresh();
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
        {items.map((i) => {
          return (
          <li className="grid grid-cols-5 py-2 px-2" key={i.item.id}>
            <p className="col-span-3">{i.item.name}</p>
            <p className="col-span-1">{i.item.likesCount}</p>
            <button className={`col-span-1 border rounded-xl ${i.isLiked? "bg-red-400" : "bg-white"}`} onClick={() => handleButtonClick(i.item.id)}>like</button>
          </li>)
        })}
      </ul>
    </div>
  );
}
