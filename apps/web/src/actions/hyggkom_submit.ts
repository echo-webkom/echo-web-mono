"use server";

import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { answers, registrations } from "@echo-webkom/db/schemas";
import { useToast } from "@/hooks/use-toast";

const shoppingListSchema = z.object({
    itemName: z.string(),
  });

export async function hyggkomSubmit( payload: z.infer<typeof shoppingListSchema>) {
  payload.itemName
  try {
    const user = await getAuth();
    const { toast } = useToast();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }
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


    const data = await registerPayloadSchema.parseAsync(payload);

   } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Skjemaet er ikke i riktig format",
      };
    }

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}
