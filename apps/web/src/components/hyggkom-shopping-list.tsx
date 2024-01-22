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
      <ul className="list-group capitalize">
        <li className="grid grid-cols-5 py-2 px-2 border-b-black bg-slate-300">
          <p className="col-span-4 font-bold">Forslag</p>
          <p className="font-bold">Like</p>
        </li>
        {items.map((i, index) => {
          return (
          <li className={`grid grid-cols-5 py-2 px-2 ${index%2 === 0? "bg-white" : "bg-slate-100"} border`}  key={i.item.id}>
            <p className="col-span-4">{i.item.name}</p>
            <button className={`col-span-1 border rounded-xl ${i.isLiked? "bg-red-400" : "bg-white"} hover:bg-red-200`} onClick={() => handleButtonClick(i.item.id)}>{i.item.likesCount}</button>
          </li>)
        })}
      </ul>
    </div>
  );
}
