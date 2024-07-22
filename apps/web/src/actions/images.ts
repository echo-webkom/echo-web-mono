"use server";

import { eq } from "drizzle-orm";
import { zfd } from "zod-form-data";

import { db } from "@echo-webkom/db";
import { users } from "@echo-webkom/db/schemas";

import { ppFor } from "@/lib/echogram";
import { authActionClient } from "@/lib/safe-action";

export const uploadProfilePictureAction = authActionClient
  .metadata({ actionName: "uploadProfilePicture" })
  .schema(
    zfd.formData({
      file: zfd.file(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { file } = parsedInput;

    if (!["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)) {
      return {
        success: false,
        message: "Bare bilder er tillatt.",
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(ppFor(user.id), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ADMIN_KEY}`,
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
  });

export const deleteProfilePictureAction = authActionClient
  .metadata({ actionName: "deleteProfilePicture" })
  .action(async ({ ctx }) => {
    const { user } = ctx;

    await fetch(`${process.env.NEXT_PUBLIC_ECHOGRAM_URL}/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.ECHOGRAM_API_KEY}`,
      },
    });

    await db
      .update(users)
      .set({
        image: null,
      })
      .where(eq(users.id, user.id));

    return {
      success: true,
    };
  });
