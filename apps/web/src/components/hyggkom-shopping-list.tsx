"use client";

import { IoHeartOutline, IoHeartSharp, IoTrashBinOutline } from "react-icons/io5";

import { hyggkomLikeSubmit, hyggkomRemoveSubmit } from "@/actions/shopping-list";
import { useToast } from "@/hooks/use-toast";
import { Text } from "./typography/text";

type itemProps = {
  id: string;
  name: string;
  likes: number;
  hasLiked: boolean;
};

type hyggkomShoppingListProps = {
  items: Array<itemProps>;
  isAdmin: boolean;
};

export function HyggkomShoppingList({ isAdmin, items }: hyggkomShoppingListProps) {
  const { toast } = useToast();

  const handleLikeButtonClick = (item: string) => {
    handleLikeClick(item).catch((error) => {
      toast({
        title: "Noe gikk galt",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    });
  };

  const handleRemoveButtonClick = (item: string) => {
    handleRemoveClick(item).catch((error) => {
      toast({
        title: "Noe gikk galt",
        description: `Error: ${error}`,
        variant: "destructive",
      });
    });
  };

  const handleLikeClick = async (item: string) => {
    const response = await hyggkomLikeSubmit(item);

    if (response.success) {
      toast({
        title: "Takk for din tilbakemelding!",
        description: response.message,
        variant: "success",
      });
    } else {
      toast({
        title: "Din like ble ikke registrert.",
        description: response.message,
        variant: "warning",
      });
    }
  };

  const handleRemoveClick = async (item: string) => {
    const response = await hyggkomRemoveSubmit(item);

    toast({
      title: "Takk for din tilbakemelding!",
      description: response.message,
      variant: "success",
    });
  };

  return (
    <ul className="rounded-md border capitalize">
      {items
        .sort((a, b) => b.likes - a.likes)
        .map((item, index) => {
          return (
            <li
              className={`flex justify-between ${index === items.length - 1 ? "rounded-b-md" : ""} ${index % 2 === 0 ? "bg-transparent" : "bg-muted"} px-6 py-1`}
              key={item.id}
            >
              <Text>{item.name}</Text>
              <div className=" flex justify-end gap-5">
                <div className="flex justify-around gap-3">
                  <Text>{item.likes}</Text>
                  <button onClick={() => handleLikeButtonClick(item.id)}>
                    {item.hasLiked ? <IoHeartSharp fill="#ED725B" /> : <IoHeartOutline />}
                  </button>
                </div>
                {isAdmin && (
                  <button onClick={() => handleRemoveButtonClick(item.id)}>
                    <IoTrashBinOutline />
                  </button>
                )}
              </div>
            </li>
          );
        })}
    </ul>
  );
}
