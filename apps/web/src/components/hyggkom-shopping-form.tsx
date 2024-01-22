"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { hyggkomSubmit } from "@/actions/hyggkom_submit";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const shoppingListSchema = z.object({
  name: z.string(),
});

export function HyggkomShoppingForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof shoppingListSchema>>({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: { name: "" },
  });
  const onSubmit = form.handleSubmit(
    async (data) => {
      const response = await hyggkomSubmit({ name: data.name });

      if (response.success) {
        toast({
          title: "Takk for forslaget!",
          description: "Ditt forslag er lagt til i listen.",
          variant: "success",
        });

        router.refresh();
      } else {
        toast({
          title: "Noe gikk galt",
          description: "Kunne ikke legge til forslaget.",
          variant: "warning",
        });
      }
    },
    (error) => {
      console.error(error);
    },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit} className="py-5">
      <fieldset className="flex flex-col gap-2 py-2">
        <Label htmlFor="" className="text-lg">Eller legg til ditt eget forslag!</Label>
        <Input type="text" {...form.register("name")} className=""/>
      </fieldset>
      <Button type="submit">Legg til ditt forslag!</Button>
    </form>
  );
}
