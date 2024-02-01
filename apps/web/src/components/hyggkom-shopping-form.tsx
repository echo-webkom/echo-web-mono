"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { hyggkomSubmit } from "@/actions/shopping-list";
import { useToast } from "@/hooks/use-toast";
import { hyggkomListSchema } from "@/lib/schemas/shoppinglist";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export function HyggkomShoppingForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof hyggkomListSchema>>({
    resolver: zodResolver(hyggkomListSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await hyggkomSubmit({ name: data.name });

    if (response.success) {
      toast({
        title: "Takk for forslaget!",
        description: "Ditt forslag er lagt til i listen.",
        variant: "success",
      });

      form.reset();
    } else {
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke legge til forslaget.",
        variant: "warning",
      });
    }
  });

  return (
    <Form {...form}>
      {/*eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
      <form onSubmit={onSubmit} className="py-5">
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="suggestion" className="text-lg">
                  Legg til ditt eget forslag!
                </FormLabel>
                <FormControl>
                  <Input id="suggestion" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Legg til</Button>
        </div>
      </form>
    </Form>
  );
}
