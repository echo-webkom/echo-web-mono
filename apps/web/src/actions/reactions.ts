"use server";

import { auth } from "@echo-webkom/auth";

import { registerReaction } from "@/data/reactions/mutations";

export async function handleReact(formData: FormData) {
  const user = await auth();
  console.log("testetts");
  if (!user) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  const reactToKey = formData.get("react_to_key");
  const emojiId = formData.get("emojiId");

  if (!reactToKey || !emojiId) {
    throw new Error("Missing data");
  }

  console.log("reactToKey", reactToKey);
  console.log("emojiId", emojiId);

  const reactionId = await registerReaction({
    reactToKey: reactToKey as string,
    emojiId: parseInt(emojiId as string),
    userId: user.id,
  });

  return {
    reactionId,
  };
}
