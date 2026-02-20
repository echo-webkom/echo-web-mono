"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

export async function uploadProfilePictureAction(formData: FormData) {
  const user = await auth();
  if (!user) {
    return {
      ok: false,
      url: null,
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return {
      ok: false,
      url: null,
    };
  }

  const imageUrl = await unoWithAdmin.files.profilePictures.upload(user.id, file);

  return {
    ok: true,
    url: imageUrl,
  };
}

export async function deleteProfilePictureAction() {
  const user = await auth();
  if (!user) {
    return false;
  }

  await unoWithAdmin.files.profilePictures.delete(user.id);

  return true;
}
