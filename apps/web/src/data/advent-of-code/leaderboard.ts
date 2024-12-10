const LEADERBOARD_ID = "3293269";
const YEAR = "2024";
const SESSION_COOKIE_NAME = "session";
const LEADERBOARD_URL = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}.json`;
const SESSION_COOKIE_VALUE = process.env.AOC_SESSION_COOKIE;

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

export const fetchAocLeaderboard = async () => {
  const headers = new Headers();
  headers.append("cookie", `${SESSION_COOKIE_NAME}=${SESSION_COOKIE_VALUE}`);

  const response = await fetch(LEADERBOARD_URL, {
    credentials: "include",
    headers: headers,
    next: {
      revalidate: 900,
    },
  });

  try {
    return (await response.json()) as Leaderboard;
  } catch {
    return null;
  }
};

type MappedLeaderboard = Array<{
  id: number;
  name: string;
  localScore: number;
  days: Record<string, 0 | 1 | 2>;
}>;

export const mapAocLeaderboard = (leaderboard: Leaderboard): MappedLeaderboard => {
  const { members } = leaderboard;

  return Object.values(members)
    .map((info) => {
      const days = Object.entries(info.completion_day_level).reduce(
        (acc, [day, dayInfo]) => {
          const hasDay1 = !!dayInfo["1"];
          const hasDay2 = !!dayInfo["2"];

          acc[day] = !hasDay1 ? 0 : hasDay2 ? 2 : 1;

          return acc;
        },
        {} as Record<string, 0 | 1 | 2>,
      );

      return {
        id: info.id,
        name: info.name,
        localScore: info.local_score,
        days,
      };
    })
    .sort((a, b) => b.localScore - a.localScore);
};
