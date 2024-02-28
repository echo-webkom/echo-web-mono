"use client";

import { IoHeartOutline, IoHeartSharp, IoTrashBinOutline } from "react-icons/io5";
import { RxDotsHorizontal } from "react-icons/rx";

import { hyggkomLikeSubmit, hyggkomRemoveSubmit } from "@/actions/shopping-list";
import { useToast } from "@/hooks/use-toast";
import { Text } from "./typography/text";
import { cn } from "@/utils/cn";

type itemProps = {
  id: string;
  name: string;
  user: string | null;
  likes: number;
  hasLiked: boolean;
};

type hyggkomShoppingListProps = {
  items: Array<itemProps>;
  isAdmin: boolean;
  withDots: boolean;
};

export function HyggkomShoppingList({ isAdmin, items, withDots }: hyggkomShoppingListProps) {
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
          if (withDots && index === items.length - 1) return;
          return (
            <li
              className={cn(
              "flex justify-between px-6 py-1 bg-transparent",
              {
              "bg-muted": index % 2 === 1,
              "rounded-b-md": index === items.length-1,
              })}
              key={item.id}
            >
              <div className="flex flex-col">
                <Text className="pb-0 pt-2">{item.name}</Text>
                {isAdmin && <Text className="py-1 text-xs font-light">{item.user}</Text>}
              </div>
              <div className="flex items-center justify-end gap-4">
                <div className="flex gap-4 items-center">
                  <Text>{item.likes}</Text>
                  <button onClick={(e) => {
                  handleLikeButtonClick(item.id)
                  }} className="p-3 rounded-md hover:bg-reaction dark:hover:bg-gray-600 h-min">
                    {item.hasLiked ? <IoHeartSharp fill="#ED725B" /> : <IoHeartOutline />}
                  </button>
                </div>

                {isAdmin && (
                  <>
                    <div className="h-2/3 w-px bg-slate-300" />
                    <button onClick={() => handleRemoveButtonClick(item.id)} className="p-3 rounded-md hover:bg-reaction dark:hover:bg-gray-600 h-min">
                      <IoTrashBinOutline />
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      {withDots && (
        <li
          className={`flex items-center justify-center rounded-b-md ${items.length % 2 === 1 ? "bg-transparent" : "bg-muted"} h-10 px-6`}
          key="dots"
        >
          <RxDotsHorizontal />
        </li>
      )}
    </ul>
  );
}
