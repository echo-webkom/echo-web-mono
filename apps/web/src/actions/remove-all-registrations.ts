"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { registrations } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { auth } from "@/auth/session";
import { cacheKeyFactory } from "@/data/registrations/revalidate";
import { isHost } from "@/lib/memberships";
import { fetchHappeningBySlug } from "@/sanity/happening";

export const removeAllRegistrations = async (slug: string) => {
  try {
    const user = await auth();
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
