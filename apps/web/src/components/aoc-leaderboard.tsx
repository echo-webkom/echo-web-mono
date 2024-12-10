import { fetchAocLeaderboard, mapAocLeaderboard } from "@/data/advent-of-code/leaderboard";
import { cn } from "@/utils/cn";

export const AocLeaderboard = async () => {
  const leaderboard = await fetchAocLeaderboard();

  if (!leaderboard) {
    return (
      <div>
        <h1>Failed to fetch leaderboard</h1>
      </div>
    );
  }

  const list = mapAocLeaderboard(leaderboard).slice(0, 14);

  return (
    <div className="h-full rounded-xl bg-[#0f0f23] p-4 font-mono text-xs text-white sm:text-sm lg:text-base">
      {list.map((user, i) => {
        return (
          <div key={user.id} className="line-clamp-1 flex items-center gap-4 text-nowrap">
            <span className="w-[30px] flex-shrink-0 text-gray-500">{i + 1})</span>
            <span className="w-[40px] flex-shrink-0">{user.localScore}</span>
            <div className="flex flex-shrink-0 items-center">
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
            <span className="flex-shrink">{user.name}</span>
          </div>
        );
      })}
    </div>
  );
};
