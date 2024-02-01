import { handleReact } from "@/actions/reactions";
import { idToEmoji } from "@/lib/emojis";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

type ReactionButtonProps = {
  reactToKey: string;
  reactions: Record<
    number,
    {
      count: number;
      hasReacted: boolean;
    }
  >;
};

export function ReactionButtons({ reactions, reactToKey }: ReactionButtonProps) {
  return (
    <div className="flex gap-2">
      {Object.entries(idToEmoji).map(([key, value]) => {
        const reactToPage = handleReact.bind(null, reactToKey, parseInt(key));
        return (
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          <form key={key} action={reactToPage}>
            <Button
              type="submit"
              className={cn(
                "h-8 w-14 rounded-full",
                reactions[Number(key)]?.hasReacted
                  ? "bg-wave text-wave-foreground hover:bg-wave"
                  : "bg-muted text-foreground hover:bg-muted",
              )}
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
