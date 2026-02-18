import { BentoBox } from "@/app/(default)/hjem/_components/bento-box";
import { cn } from "@/utils/cn";
import { unoWithAdmin } from "../api/server";

export const LEADERBOARD_ID = "3293269";
export const YEAR = "2025";
export const LEADERBOARD_URL = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}`;

const formatStarTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("no-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Oslo",
  });
};

const MAX_ITEMS = 10;

/**
 * Display the leaderboard for echo's private Advent of Code leaderboard.
 * Make sure that the environment variable `AOC_SESSION_COOKIE` is set, or
 * else it won't be able to fetch the leaderobard.
 */
type AocLeaderboardProps = {
  className?: string;
};

export const AocLeaderboard = async ({ className }: AocLeaderboardProps) => {
  const rows = (await unoWithAdmin.adventOfCode.leaderboard()).slice(0, MAX_ITEMS);

  if (!rows) {
    return (
      <div>
        <h1>Failed to fetch leaderboard</h1>
      </div>
    );
  }

  return (
    <BentoBox
      title={`Advent of Code ${YEAR}`}
      href={LEADERBOARD_URL}
      className={cn(
        "relative max-h-100 overflow-hidden rounded-lg border-2 border-[#298a08] bg-[#0f0f23] p-4 font-mono text-xs text-white sm:text-sm lg:text-base",
        className,
      )}
    >
      <div className="relative h-full overflow-hidden">
        <p className="wrap-break-words mb-4 text-gray-400">
          Bli med ved å joine {LEADERBOARD_ID}-fc78f7d2 her:{" "}
          <a
            href="https://adventofcode.com/2025/leaderboard/private"
            className="break-all underline"
          >
            https://adventofcode.com/2025/leaderboard/private
          </a>
        </p>

        <ol>
          {rows.map((user, i) => {
            // Calculate rank: same score as previous = same rank (omit number)
            const prevUser = i > 0 ? rows[i - 1] : undefined;
            const isTied = prevUser?.localScore === user.localScore;
            const rank = isTied ? null : i + 1;

            return (
              <li key={user.id} className="flex items-center gap-4">
                <span className="w-7.5 shrink-0 text-gray-500">
                  {rank !== null ? `${rank})` : ""}
                </span>
                <span className="w-10 shrink-0 text-right">{user.localScore}</span>
                <div className="flex shrink-0 items-center text-base">
                  {Array.from({ length: 12 }).map((_, j) => {
                    const dayInfo = user.days[j + 1];
                    const completed = dayInfo?.stars ?? 0;

                    let tooltipText = "";
                    if (completed === 2 && dayInfo?.star1Ts && dayInfo?.star2Ts) {
                      tooltipText = `⭐ ${formatStarTimestamp(dayInfo.star1Ts)}\n⭐⭐ ${formatStarTimestamp(dayInfo.star2Ts)}`;
                    } else if (completed === 1 && dayInfo?.star1Ts) {
                      tooltipText = `⭐ ${formatStarTimestamp(dayInfo.star1Ts)}`;
                    }

                    return (
                      <span
                        key={j}
                        className={cn("text-[#0f0f23]", {
                          "text-yellow-400": completed === 2,
                          "text-blue-700": completed === 1,
                        })}
                        title={tooltipText}
                      >
                        *
                      </span>
                    );
                  })}
                </div>
                <span className="min-w-0 flex-1 truncate">{user.name}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </BentoBox>
  );
};
