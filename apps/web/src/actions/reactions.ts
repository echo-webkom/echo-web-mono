"use server";

import { registerReaction } from "@/data/reactions/mutations";
import { idToEmoji } from "@/lib/emojis";
import { getUser } from "@/lib/get-user";

type ActionResponse =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export const reactToAction = async (
  _previousState: ActionResponse | undefined,
  formData: FormData,
): Promise<ActionResponse> => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  const reactToKey = formData.get("reactToKey") as string;
  const emojiId = Number(formData.get("emojiId"));

  if (emojiId < 0 || emojiId > Object.keys(idToEmoji).length) {
    return {
      success: false,
      message: "Reaksjon finnes ikke",
    };
  }

  await registerReaction({
    reactToKey: reactToKey,
    emojiId: emojiId,
    userId: user.id,
  });

  return {
    success: true,
  };
};
