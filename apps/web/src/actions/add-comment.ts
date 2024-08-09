"use server";

import { z } from "zod";

import { db } from "@echo-webkom/db";
import { comments } from "@echo-webkom/db/schemas";

import { revalidateComments } from "@/data/comments/revalidate";
import { authActionClient } from "@/lib/safe-action";

export const addCommentAction = authActionClient
  .metadata({ actionName: "addComment" })
  .schema(
    z.object({
      postId: z.string(),
      content: z.string(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { postId, content } = parsedInput;
    const { id: userId } = ctx.user;

    await db.insert(comments).values({
      content,
      postId,
      userId,
    });

    revalidateComments(postId);

    return {
      success: true,
    };
  });

export const addReplyAction = authActionClient
  .metadata({ actionName: "addReply" })
  .schema(
    z.object({
      postId: z.string(),
      content: z.string(),
      parentId: z.string(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { postId, content, parentId } = parsedInput;
    const { id: userId } = ctx.user;

    await db.insert(comments).values({
      content,
      postId,
      userId,
      parentCommentId: parentId,
    });

    revalidateComments(postId);

    return {
      success: true,
    };
  });
