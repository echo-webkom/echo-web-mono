"use client";

import { useRouter } from "next/navigation";
import { IoHeartOutline, IoHeartSharp, IoTrashBinOutline } from "react-icons/io5";

import { type auth } from "@echo-webkom/auth";

import { type Item } from "@/actions/get_color_like_button";
import { hyggkomLikeSubmit } from "@/actions/hyggkom_like_submit";
import { hyggkomRemoveSubmit } from "@/actions/hyggkom_remove_submit";
import { useToast } from "@/hooks/use-toast";
import { isMemberOf } from "@/lib/memberships";
import { Text } from "./typography/text";

type itemProps = {
  item: Item;
  isLiked: boolean;
};

type hyggkomShoppingListProps = {
  items: Array<itemProps>;
  user: Awaited<ReturnType<typeof auth>> | null;
};

export function HyggkomShoppingList({ user, items }: hyggkomShoppingListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLikeButtonClick = (item: string) => {
    handleLikeClick(item).catch((error) => {
      toast({
        title: "Noe gikk galt",
        description: `Error: ${error}`,
        variant: "destructive",
      });

      router.refresh();
    });
  };

  const handleRemoveButtonClick = (item: string) => {
    handleRemoveClick(item).catch((error) => {
      toast({
        title: "Noe gikk galt",
        description: `Error: ${error}`,
        variant: "destructive",
      });

      router.refresh();
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

      router.refresh();
    } else {
      toast({
        title: "Din like ble ikke registrert.",
        description: response.message,
        variant: "warning",
      });

      router.refresh();
    }
  };

  const handleRemoveClick = async (item: string) => {
    const response = await hyggkomRemoveSubmit(item);

    toast({
      title: "Takk for din tilbakemelding!",
      description: response.message,
      variant: "success",
    });

    router.refresh();
  };

  const isAdmin = user && isMemberOf(user, ["webkom", "hyggkom"]);

  return (
    <ul className="rounded-md border capitalize">
      {items.map((i, index) => {
        return (
          <li
            className={`flex justify-between ${index === items.length - 1 ? "rounded-b-md" : ""} ${index % 2 === 0 ? "bg-transparent" : "bg-slate-100"} px-6 py-1`}
            key={i.item.id}
          >
            <Text>{i.item.name}</Text>
            <div className=" flex justify-end gap-5">
              <div className="flex justify-around gap-3">
                <Text>{i.item.likesCount}</Text>
                <button onClick={() => handleLikeButtonClick(i.item.id)}>
                  {i.isLiked ? <IoHeartSharp fill="#ED725B" /> : <IoHeartOutline />}
                </button>
              </div>
              {user !== null && isAdmin && (
                <button onClick={() => handleRemoveButtonClick(i.item.id)}>
                  <IoTrashBinOutline></IoTrashBinOutline>
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
