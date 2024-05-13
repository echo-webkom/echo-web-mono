import { getReactionByReactToKey } from "@/data/reactions/queries";
import { idToEmoji } from "@/lib/emojis";
import { getUser } from "@/lib/get-user";
import ReactionButton from "./reaction-button";

type ReactionButtonGroupProps = {
  reactToKey: string;
};

export async function ReactionButtonGroup({ reactToKey }: ReactionButtonGroupProps) {
  const [reactions, user] = await Promise.all([getReactionByReactToKey(reactToKey), getUser()]);

  return (
    <div className="flex gap-3">
      {Object.entries(idToEmoji).map(([key, value]) => {
        const count = reactions.filter((r) => r.emojiId === Number(key)).length;
        const hasReacted = reactions.some(
          (r) => r.emojiId === Number(key) && r.userId === user?.id,
        );
        return (
          <ReactionButton
            key={reactToKey}
            reactToKey={reactToKey}
            hasReacted={hasReacted}
            emojiId={Number(key)}
            count={count ?? 0}
          >
            {value}
          </ReactionButton>
        );
      })}
    </div>
  );
}
