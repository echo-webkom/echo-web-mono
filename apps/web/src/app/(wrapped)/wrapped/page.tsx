import { getUser } from "@/lib/get-user";
import { UserStatsProvider, type UserWrappedData } from "./components/UserContext";
import { WrappedClient } from "./components/wrapped-client";

const fetchStats = async (userId: string) => {
  if (process.env.NODE_ENV === "development") {
    // only use in development
    // id of jesper
    userId = "52c5eb16-cbd2-4043-9cbd-26704d7ab7bf";
  }

  const resp = await fetch(`https://echo-wrapped-stats.fly.dev/stats/${userId}`, {
    cache: "no-cache",
    headers: {
      Authorization: process.env.ADMIN_KEY!,
    },
  });

  if (!resp.ok) {
    return null;
  }

  return (await resp.json()) as Exclude<UserWrappedData, null>;
};

export default async function Wrapped() {
  const user = await getUser();
  const stats = user?.id ? await fetchStats(user.id) : null;

  return (
    <UserStatsProvider data={stats}>
      <WrappedClient isSignedIn={!!user} />
    </UserStatsProvider>
  );
}
