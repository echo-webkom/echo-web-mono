import { handleReact } from "@/actions/reactions";
import { idToEmoji } from "@/lib/emojis";
import { cn } from "@/utils/cn";
import ReactionButton from "./reaction-button";
import { Button } from "./ui/button";

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
        const reactToPage = handleReact.bind(null, reactToKey, parseInt(key));
        const reaction = reactions[Number(key)];
        return (
          <form key={key} action={reactToPage}>
            <ReactionButton
              value={value}
              hasReacted={reaction?.hasReacted ?? false}
              count={reaction?.count ?? 0}
            />
          </form>
        );
      })}
    </div>
  );
}
