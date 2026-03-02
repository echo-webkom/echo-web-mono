"use server";

import { revalidatePath } from "next/cache";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

export async function uploadProfilePictureAction(formData: FormData) {
  const user = await auth();
  if (!user) {
    return { ok: false as const, message: "Unauthorized" };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, message: "No file provided" };
  }

  const response = await unoWithAdmin.files.profilePictures.upload(user.id, file);

  revalidatePath("/", "layout");

  return response;
}

export async function deleteProfilePictureAction() {
  const user = await auth();
  if (!user) {
    return false;
  }

  const ok = await unoWithAdmin.files.profilePictures.delete(user.id);

  revalidatePath("/", "layout");

  return ok;
}
