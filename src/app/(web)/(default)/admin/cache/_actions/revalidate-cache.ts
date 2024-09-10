"use server";

import { revalidateTag } from "next/cache";

import { getUser } from "@/lib/get-user";
import { isWebkom } from "@/lib/memberships";

export const revalidateCacheAction = async (tag: string) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (!isWebkom(user)) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

  revalidateTag(tag);

  return {
    success: true,
    message: "Cachen er revalidert",
  };
};
