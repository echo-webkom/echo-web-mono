import { auth } from "@echo-webkom/auth";

import { getReactionByReactToKey } from "@/data/reactions/queries";
import { idToEmoji } from "@/lib/emojis";
import ReactionButton from "./reaction-button";

type ReactionButtonGroupProps = {
  reactToKey: string;
};

export async function ReactionButtonGroup({ reactToKey }: ReactionButtonGroupProps) {
  const reactions = await getReactionByReactToKey(reactToKey);
  const user = await auth();

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
