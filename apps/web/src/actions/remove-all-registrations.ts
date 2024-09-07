"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { registrations } from "@echo-webkom/db/schemas";

import { getFullHappening } from "@/data/happenings/queries";
import { cacheKeyFactory } from "@/data/registrations/revalidate";
import { getUser } from "@/lib/get-user";
import { isHost } from "@/lib/memberships";

export const removeAllRegistrations = async (slug: string) => {
  try {
    const user = await getUser();
    const happening = await getFullHappening(slug);

    if (!user || !happening || !isHost(user, happening)) {
      return {
        success: false,
        message: "Invalid user",
      };
    }

    await db.delete(registrations).where(eq(registrations.happeningId, happening.id));
    revalidateTag(cacheKeyFactory.registrationsHappening(happening.id));
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
