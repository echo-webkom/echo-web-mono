import { auth } from "@/auth/session";
import { idToEmoji } from "@/lib/emojis";
import { unoWithAdmin } from "../api/server";
import { ReactionButton } from "./reaction-button";

type ReactionButtonGroupProps = {
  reactToKey: string;
};

export const ReactionButtonGroup = async ({ reactToKey }: ReactionButtonGroupProps) => {
  const [reactions, user] = await Promise.all([unoWithAdmin.reactions.byId(reactToKey), auth()]);

  return (
    <div className="flex gap-3">
      {Object.entries(idToEmoji).map(([key, value]) => {
        const count = reactions.filter((r) => r.emojiId === Number(key)).length;
        const hasReacted = reactions.some(
          (r) => r.emojiId === Number(key) && r.userId === user?.id,
        );

        return (
          <ReactionButton
            key={key}
            reactToKey={reactToKey}
            hasReacted={hasReacted}
            emojiId={Number(key)}
            count={count ?? 0}
            userId={user?.id}
          >
            {value}
          </ReactionButton>
        );
      })}
    </div>
  );
};
