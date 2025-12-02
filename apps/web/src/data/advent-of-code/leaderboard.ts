export const LEADERBOARD_ID = "3293269";
export const YEAR = "2025";
export const SESSION_COOKIE_NAME = "session";
export const LEADERBOARD_URL = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}`;
export const SESSION_COOKIE_VALUE = process.env.AOC_SESSION_COOKIE;

type StarInfo = {
  star_index: number;
  get_star_ts: number;
};

type MemberInfo = {
  name: string;
  id: number;
  last_star_ts: number;
  stars: number;
  local_score: number;
  global_score: number;
  completion_day_level: Record<string, Record<string, StarInfo>>;
};

type Leaderboard = {
  members: Record<string, MemberInfo>;
  owner_id: number;
  day1_ts: number;
  event: string;
};

type DayInfo = {
  stars: 0 | 1 | 2;
  star1Ts?: number;
  star2Ts?: number;
};

type MappedMember = {
  id: number;
  name: string;
  localScore: number;
  days: Record<string, DayInfo>;
};

export const fetchAocLeaderboard = async () => {
  try {
    const response = await fetch(`${LEADERBOARD_URL}.json`, {
      credentials: "include",
      headers: {
        Cookie: `${SESSION_COOKIE_NAME}=${SESSION_COOKIE_VALUE}`,
        "User-Agent": "echo-web (https://echo.uib.no)",
      },
      next: {
        revalidate: 900,
      },
    });

    return (await response.json()) as Leaderboard;
  } catch (error) {
    console.error("Failed to fetch AOC leaderboard", error);
    return null;
  }
};

export const mapAocLeaderboard = (leaderboard: Leaderboard): Array<MappedMember> => {
  const { members } = leaderboard;

  return Object.values(members)
    .map((info) => {
      const days = Object.entries(info.completion_day_level).reduce(
        (acc, [day, dayInfo]) => {
          const hasDay1 = !!dayInfo["1"];
          const hasDay2 = !!dayInfo["2"];

          acc[day] = {
            stars: !hasDay1 ? 0 : hasDay2 ? 2 : 1,
            star1Ts: dayInfo["1"]?.get_star_ts,
            star2Ts: dayInfo["2"]?.get_star_ts,
          };

          return acc;
        },
        {} as Record<string, DayInfo>,
      );

      return {
        id: info.id,
        name: info.name ?? `Ukjent bruker #${info.id}`,
        localScore: info.local_score,
        days,
      };
    })
    .sort((a, b) => b.localScore - a.localScore);
};
