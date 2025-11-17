import { BentoBox } from "@/app/(default)/hjem/_components/bento-box";
import {
  fetchAocLeaderboard,
  LEADERBOARD_ID,
  LEADERBOARD_URL,
  mapAocLeaderboard,
  YEAR,
} from "@/data/advent-of-code/leaderboard";
import { cn } from "@/utils/cn";
import { AocCountdownOverlay } from "./aoc-countdown-overlay";

/**
 * Display the leaderboard for echo's private Advent of Code leaderboard.
 * Make sure that the environment variable `AOC_SESSION_COOKIE` is set, or
 * else it won't be able to fetch the leaderobard.
 */
type AocLeaderboardProps = {
  className?: string;
};

export const AocLeaderboard = async ({ className }: AocLeaderboardProps) => {
  const leaderboard = await fetchAocLeaderboard();

  if (!leaderboard) {
    return (
      <div>
        <h1>Failed to fetch leaderboard</h1>
      </div>
    );
  }

  const list = mapAocLeaderboard(leaderboard).slice(0, 13);

  return (
    <BentoBox
      title={`Advent of Code ${YEAR}`}
      href={LEADERBOARD_URL}
      className={cn(
        "relative h-full rounded-lg border-2 border-[#298a08] bg-[#0f0f23] p-4 font-mono text-xs text-white sm:text-sm lg:text-base",
        className,
      )}
    >
      <div className="relative h-full min-h-[400px]">
        <AocCountdownOverlay joinUrl={`https://adventofcode.com/${YEAR}/leaderboard/private`} />
        <p className="mb-4 text-gray-400">
          Bli med ved å joine {LEADERBOARD_ID} her:{" "}
          <a href="https://adventofcode.com/2025/leaderboard/private" className="underline">
            https://adventofcode.com/2025/leaderboard/private
          </a>
        </p>

        <ol>
          {list.map((user, i) => {
            const isLongName = user.name.length > 12;
            const name = isLongName ? user.name.slice(0, 9) + "..." : user.name;
            return (
              <li key={user.id} className="line-clamp-1 flex items-center gap-4 text-nowrap">
                <span className="w-[30px] shrink-0 text-gray-500">{i + 1})</span>
                <span className="block w-[60px] shrink-0 sm:hidden">{name}</span>
                <span className="w-[40px] shrink-0">{user.localScore}</span>
                <div className="flex shrink-0 items-center">
                  {Array.from({ length: 25 }).map((_, i) => {
                    const completed = user.days[i + 1];
                    return (
                      <span
                        key={i}
                        className={cn("text-[#0f0f23]", {
                          "text-yellow-400": completed === 2,
                          "text-blue-700": completed === 1,
                        })}
                      >
                        *
                      </span>
                    );
                  })}
                </div>
                <span className="hidden shrink sm:block">{user.name}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </BentoBox>
  );
};
