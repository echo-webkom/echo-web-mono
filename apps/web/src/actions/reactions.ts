"use server";

import { auth } from "@echo-webkom/auth";

import { registerReaction } from "@/data/reactions/mutations";

export async function handleReact(formData: FormData) {
  const user = await auth();

  if (!user) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  const happeningId = formData.get("happeningId");
  const emojiId = formData.get("emojiId");

  if (!happeningId || !emojiId) {
    throw new Error("Missing data");
  }

  const reactionId = await registerReaction({
    happeningId: happeningId as string,
    emojiId: parseInt(emojiId as string),
    userId: user.id,
  });

  return {
    reactionId,
  };
}
