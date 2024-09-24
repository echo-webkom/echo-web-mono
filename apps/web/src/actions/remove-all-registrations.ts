"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { registrations } from "@echo-webkom/db/schemas";

import { cacheKeyFactory } from "@/data/registrations/revalidate";
import { getUser } from "@/lib/get-user";
import { isHost } from "@/lib/memberships";
import { fetchHappeningBySlug } from "@/sanity/happening";

export const removeAllRegistrations = async (slug: string) => {
  try {
    const user = await getUser();
    const happening = await fetchHappeningBySlug(slug);

    const groups = happening?.organizers?.map((organizer) => organizer.slug) ?? [];
    if (!user || !happening || !isHost(user, groups)) {
      return {
        success: false,
        message: "Invalid user",
      };
    }

    await db.delete(registrations).where(eq(registrations.happeningId, happening._id));
    revalidateTag(cacheKeyFactory.registrationsHappening(happening._id));
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
