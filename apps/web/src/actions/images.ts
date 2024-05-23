"use server";

import { File } from "node:buffer";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { users } from "@echo-webkom/db/schemas";

import { ppFor } from "@/lib/echogram";
import { getUser } from "@/lib/get-user";

export const uploadProfilePictureAction = async (formData: FormData) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn.",
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

  const response = await fetch(ppFor(user.id), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ECHOGRAM_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Noe gikk galt.",
    };
  }

  const imageUrl = ppFor(user.id);

  await db.update(users).set({ image: imageUrl }).where(eq(users.id, user.id));

  return {
    success: true,
    message: imageUrl,
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_ECHOGRAM_URL}/${user.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.ECHOGRAM_API_KEY}`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Noe gikk galt.",
    };
  }

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
