"use server";

import { revalidateTag } from "next/cache";

import { checkAuthorization } from "@/utils/server-action-helpers";
import { isWebkom } from "@/lib/memberships";

export const revalidateCacheAction = async (tag: string) => {
  const authError = await checkAuthorization({ customCheck: (user) => isWebkom(user) });
  if (authError) return authError;

  revalidateTag(tag, "max");

  return {
    success: true,
    message: "Cachen er revalidert",
  };
};
