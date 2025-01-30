"use server";

import { File } from "node:buffer";
import { eq } from "drizzle-orm";

import { users } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { ppFor } from "@/lib/echogram";
import { getUser } from "@/lib/get-user";

const deleteImage = (id: string) =>
  fetch(ppFor(id), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_KEY}`,
    },
  });

const uploadImage = (id: string, formData: FormData) =>
  fetch(ppFor(id), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_KEY}`,
    },
    body: formData,
  });

export const uploadProfilePictureAction = async (formData: FormData) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn.",
    };
  }

  if (!formData.has("file")) {
    return {
      success: false,
      message: "Du må laste opp et bilde.",
    };
  }

  const file = formData.get("file");

  if (
    !(file instanceof File) ||
    !["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
  ) {
    return {
      success: false,
      message: "Bare bilder er tillatt.",
    };
  }

  if (file.size / 1024 / 1024 > 5) {
    return {
      success: false,
      message: "Bildet er for stort. Maks 5MB.",
    };
  }

  if (user.image) {
    await deleteImage(user.image);
  }

  const imageId = `${user.id}-${Date.now()}`;

  const response = await uploadImage(imageId, formData);
  if (!response.ok) {
    return {
      success: false,
      message: "Noe gikk galt.",
    };
  }

  await db
    .update(users)
    .set({ image: ppFor(imageId) })
    .where(eq(users.id, user.id));

  return {
    success: true,
    message: ppFor(imageId),
  };
};

export const deleteProfilePictureAction = async () => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn.",
    };
  }

  if (!user.image) {
    return {
      success: false,
      message: "Du har ikke et profilbilde.",
    };
  }

  await deleteImage(user.image);

  await db
    .update(users)
    .set({
      image: null,
    })
    .where(eq(users.id, user.id));

  return {
    success: true,
  };
};
