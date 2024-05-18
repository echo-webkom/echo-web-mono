"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { comments } from "@echo-webkom/db/schemas";

import { revalidateComments } from "@/data/comments/revalidate";
import { getUser } from "@/lib/get-user";

export const deleteCommentAction = async (body: FormData) => {
  const id = body.get("id");

  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "Invalid id",
    };
  }

  const user = await getUser();

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

  let postId: string | undefined = undefined;

  if (hasChildren) {
    postId = await db
      .update(comments)
      .set({
        content: "[slettet]",
        userId: null,
      })
      .where(eq(comments.id, id))
      .returning()
      .then((res) => res[0]?.postId);
  } else {
    postId = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning()
      .then((res) => res[0]?.postId);
  }

  if (postId) {
    revalidateComments(postId);
  }

  return {
    success: true,
  };
};
