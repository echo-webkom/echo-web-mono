import { idToEmoji } from "@/lib/emojis";
import ReactionButton from "./reaction-button";

type ReactionButtonGroupProps = {
  reactToKey: string;
  reactions: Record<
    number,
    {
      count: number;
      hasReacted: boolean;
    }
  >;
};

export function ReactionButtonGroup({ reactions, reactToKey }: ReactionButtonGroupProps) {
  return (
    <div className="flex gap-3">
      {Object.entries(idToEmoji).map(([key, value]) => {
        const reaction = reactions[Number(key)];
        return (
          <ReactionButton
            key={reactToKey}
            reactToKey={reactToKey}
            hasReacted={reaction?.hasReacted ?? false}
            emojiId={Number(key)}
            count={reaction?.count ?? 0}
          >
            {value}
          </ReactionButton>
        );
      })}
    </div>
  );
}
