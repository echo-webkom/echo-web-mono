import { getReactionByReactToKey } from "@/data/reactions/queries";
import { idToEmoji } from "@/lib/emojis";
import { getUser } from "@/lib/get-user";
import { ReactionButtons } from "./reaction-buttons";

type ReactionsProps = {
  reactToKey: string;
};

export const Reactions = async ({ reactToKey }: ReactionsProps) => {
  const [_reactions, user] = await Promise.all([getReactionByReactToKey(reactToKey), getUser()]);

  const reactions = Object.keys(idToEmoji).map((id) => {
    const count = _reactions.filter((reaction) => reaction.emojiId === Number(id)).length;
    const hasReacted = user
      ? _reactions.some(
          (reaction) => reaction.emojiId === Number(id) && reaction.userId === user.id,
        )
      : false;

    return {
      emojiId: Number(id),
      count,
      hasReacted,
      reactToKey,
    };
  });

  return <ReactionButtons reactions={reactions} />;
};
