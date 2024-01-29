import { handleReact } from "@/actions/reactions";
import { Button } from "./ui/button";

type ReactionButtonProps = {
  happeningId: string;
  reactions: Record<
    number,
    {
      count: number;
      hasReacted: boolean;
    }
  >;
};

const idToEmoji: Record<number, string> = {
  0: "🥳",
  1: "🔥",
  2: "🚀",
  3: "🍕",
};

export function ReactionButtons({ reactions, happeningId }: ReactionButtonProps) {
  return (
    <div className="flex gap-2">
      {Object.entries(idToEmoji).map(([key, value]) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          <form key={key} action={handleReact}>
            <input type="hidden" name="emojiId" value={key} />
            <input type="hidden" name="happeningId" value={happeningId} />
            <Button
              type="submit"
              className={`${reactions[Number(key)]?.hasReacted ? "bg-wave hover:bg-wave" : "bg-muted hover:bg-muted"} h-8 w-14 rounded-full text-foreground`}
            >
              <div className="flex gap-1 font-normal">
                <p>{value}</p>
                <p>{reactions[Number(key)]?.count ?? 0}</p>
              </div>
            </Button>
          </form>
        );
      })}
    </div>
  );
}
