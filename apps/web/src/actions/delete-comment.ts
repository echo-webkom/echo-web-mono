"use server";

import { and, eq } from "drizzle-orm";

import { comments } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { auth } from "@/auth/session";

export const deleteCommentAction = async (body: FormData) => {
  const id = body.get("id");

  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "Invalid id",
    };
  }

  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const hasChildren = await db.query.comments
    .findFirst({
      where: and(eq(comments.parentCommentId, id)),
    })
    .then((res) => !!res);

  if (hasChildren) {
    await db
      .update(comments)
      .set({
        content: "[slettet]",
        userId: null,
      })
      .where(eq(comments.id, id));
  } else {
    await db.delete(comments).where(eq(comments.id, id));
  }

  return {
    success: true,
  };
};
