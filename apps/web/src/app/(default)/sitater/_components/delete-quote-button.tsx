"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
