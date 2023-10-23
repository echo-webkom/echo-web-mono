"use client";

//import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Container } from "@/components/container";
import { ShoppingList } from "@/components/hyggkomShoppingList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

//import { Heading } from "@/components/ui/heading";

const shoppingListSchema = z.object({
  itemName: z.string(),
});

export default function HyggkomHandleliste() {
  const itemList = ["epler", "Bananer", "Pærer", "Druer"];

  const { toast } = useToast();

  const form = useForm<z.infer<typeof shoppingListSchema>>({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: { itemName: "" },
  });
  const onSubmit = form.handleSubmit(
    async (data) => {
      const response = await fetch("/api/hyggkomShoppingList", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Takk for forslaget!",
          description: "Ditt forslag er lagt til i listen.",
          variant: "success",
        });
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
    <Container className="max-w-xl">
      <ShoppingList items={itemList}></ShoppingList>
      <form>
        <fieldset className="flex flex-col gap-2">
          <Label htmlFor="">Hva ønsker du?</Label>
          <Input type="text" />
        </fieldset>
        <Button type="submit">Legg til ditt forslag!</Button>
      </form>
    </Container>
  );
}
