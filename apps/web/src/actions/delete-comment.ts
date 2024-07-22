"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { db } from "@echo-webkom/db";
import { comments } from "@echo-webkom/db/schemas";

import { revalidateComments } from "@/data/comments/revalidate";
import { authActionClient } from "@/lib/safe-action";

export const deleteCommentAction = authActionClient
  .metadata({ actionName: "deleteComment" })
  .schema(zfd.formData(z.object({ id: z.string() })))
  .action(async ({ parsedInput, ctx }) => {
    const { id: commentId } = parsedInput;
    const { user } = ctx;

    const comment = await db.query.comments.findFirst({
      where: (comment, { and, eq }) => and(eq(comment.userId, user.id), eq(comment.id, commentId)),
    });

    if (!comment) {
      return {
        success: false,
        message: "Ingen kommentar funnet",
      };
    }

    /**
     * If the comment has replies, we don't want to delete it, but
     * we want to remove the user from the comment and the content.
     */
    const commentHasComments = await db.query.comments
      .findFirst({
        where: and(eq(comments.parentCommentId, commentId)),
      })
      .then((res) => !!res);

    let postId: string | undefined = undefined;

    if (commentHasComments) {
      postId = await db
        .update(comments)
        .set({
          content: "[slettet]",
          userId: null,
        })
        .where(eq(comments.id, commentId))
        .returning()
        .then((res) => res[0]?.postId);
    } else {
      postId = await db
        .delete(comments)
        .where(eq(comments.id, commentId))
        .returning()
        .then((res) => res[0]?.postId);
    }

    if (postId) {
      revalidateComments(postId);
    }

    return {
      success: true,
    };
  });
