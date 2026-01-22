import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import ky from "ky";

import { CompanyLeagueBanner, type Match } from "@/components/company-league-banner";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { cn } from "@/utils/cn";

const LEAGUE_TABLE_URL = "https://databrus.echo-webkom.no/table";
const MATCHES_URL = "https://databrus.echo-webkom.no/matches";
const DATABRUS_FC = "Databrus FC";

export interface TableEntry {
  position: number;
  team: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

const fetchLeagueTable = async () => {
  return await ky
    .get(LEAGUE_TABLE_URL, {
      headers: {
        accept: "application/json",
      },
      next: {
        revalidate: 720,
      },
    })
    .json<Array<TableEntry>>();
};

const fetchMatches = async () => {
  return await ky
    .get(MATCHES_URL, {
      headers: {
        accept: "application/json",
      },
      next: {
        revalidate: 720,
      },
    })
    .json<Array<Match>>();
};

export default async function DatabrusPage() {
  const [table, matches] = await Promise.all([fetchLeagueTable(), fetchMatches()]);

  const upcomingMatches = matches
    .filter((match) => match.type === "upcoming")
    .filter((match) => match.homeTeam === DATABRUS_FC || match.awayTeam === DATABRUS_FC)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  return (
    <Container className="py-10">
      <Heading className="mb-4">Databrus FC</Heading>

      <CompanyLeagueBanner />

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Tabell</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left text-sm font-medium">#</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Lag</th>
                <th className="px-4 py-2 text-center text-sm font-medium">K</th>
                <th className="px-4 py-2 text-center text-sm font-medium">S</th>
                <th className="px-4 py-2 text-center text-sm font-medium">U</th>
                <th className="px-4 py-2 text-center text-sm font-medium">T</th>
                <th className="px-4 py-2 text-center text-sm font-medium">M+</th>
                <th className="px-4 py-2 text-center text-sm font-medium">M-</th>
                <th className="px-4 py-2 text-center text-sm font-medium">+/-</th>
                <th className="px-4 py-2 text-center text-sm font-medium">P</th>
              </tr>
            </thead>
            <tbody>
              {table.map((entry) => (
                <tr
                  key={entry.position}
                  className={cn("border-b", {
                    "bg-muted/50 font-medium": entry.team === DATABRUS_FC,
                  })}
                >
                  <td className="px-4 py-2 text-sm">{entry.position}</td>
                  <td className="px-4 py-2 text-sm">{entry.team}</td>
                  <td className="px-4 py-2 text-center text-sm">{entry.matchesPlayed}</td>
                  <td className="px-4 py-2 text-center text-sm">{entry.wins}</td>
                  <td className="px-4 py-2 text-center text-sm">{entry.draws}</td>
                  <td className="px-4 py-2 text-center text-sm">{entry.losses}</td>
                  <td className="px-4 py-2 text-center text-sm">{entry.goalsFor}</td>
                  <td className="px-4 py-2 text-center text-sm">{entry.goalsAgainst}</td>
                  <td
                    className={cn("px-4 py-2 text-center text-sm", {
                      "text-green-600": entry.goalDifference > 0,
                      "text-red-600": entry.goalDifference < 0,
                    })}
                  >
                    {entry.goalDifference > 0 ? "+" : ""}
                    {entry.goalDifference}
                  </td>
                  <td className="px-4 py-2 text-center text-sm font-medium">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {upcomingMatches.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Kommende kamper</h2>
          <div className="space-y-3">
            {upcomingMatches.map((match) => {
              const isDatabrusHome = match.homeTeam === DATABRUS_FC;
              const opponent = isDatabrusHome ? match.awayTeam : match.homeTeam;
              const matchDate = parseISO(match.datetime);

              return (
                <div
                  key={match.id}
                  className="bg-card flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{DATABRUS_FC}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="font-medium">{opponent}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(matchDate, "EEEE d. MMMM", { locale: nb })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Container>
  );
}
