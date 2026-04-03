"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isHost } from "@/lib/memberships";

export const removeAllRegistrations = async (slug: string) => {
  try {
    const user = await auth();
    const happening = await unoWithAdmin.sanity.happenings.bySlug(slug).catch(() => null);

    const groups = happening?.organizers?.map((organizer) => organizer.slug) ?? [];
    if (!user || !happening || !isHost(user, groups)) {
      return {
        success: false,
        message: "Invalid user",
      };
    }

    await unoWithAdmin.happenings.clearRegistrations(happening._id);
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
