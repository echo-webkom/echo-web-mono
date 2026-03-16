"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RxTrash as Trash } from "react-icons/rx";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUnoClient } from "@/providers/uno";

type Props = {
  id: string;
};

export function DeleteQuoteButton({ id }: Props) {
  const unoClient = useUnoClient();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const ok = await unoClient.quotes.delete(id);
      if (ok) {
        toast.success("Sitat slettet!");
        router.refresh();
      } else {
        toast.error("Kunne ikke slette sitat");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive hover:text-destructive"
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
}
