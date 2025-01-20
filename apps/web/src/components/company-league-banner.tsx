import { format } from "date-fns";
import ky from "ky";
import Marquee from "react-fast-marquee";

import { cn } from "@/utils/cn";

const DATABRUS_FC_ID = 1003134;

type Match = {
  matchId: number;
  matchNo: string;
  activityAreaId: number;
  activityAreaLatitude: string;
  activityAreaLongitude: string;
  activityAreaName: string;
  activityAreaNo: string;
  admOrgId: number;
  arrOrgId: number;
  arrOrgNo: number;
  arrOrgName: string;
  awayteamId: number;
  awayteamOrgNo: string;
  awayteam: string;
  awayteamOrgName: string;
  awayteamOverriddenName: string;
  awayteamClubOrgId: number;
  hometeamId: number;
  hometeam: string;
  hometeamOrgName: string;
  hometeamOverriddenName: string;
  hometeamOrgNo: string;
  hometeamClubOrgId: number;
  roundId: number;
  roundName: string;
  seasonId: number;
  tournamentName: string;
  matchDate: string;
  matchStartTime: number;
  matchEndTime: number;
  venueUnitId: number;
  venueUnitNo: string;
  venueId: number;
  venueNo: string;
  physicalAreaId: number;
  matchResult: {
    homeGoals: number;
    awayGoals: number;
    matchEndResult: string;
  } | null;
  liveArena: boolean;
  liveClientType: string;
  statusTypeId: number;
  statusType: string;
  lastChangeDate: string;
  spectators: number;
  actualMatchDate: string;
  actualMatchStartTime: string;
  actualMatchEndTime: string;
  sportId: number;
};

type CompanyLeagueTable = {
  tournamentId: number;
  tournamentNo: string;
  matches: Array<Match>;
};

const fetchCompanyLeagueTableMatches = async () => {
  return await ky
    .get(
      "https://sf15-terminlister-prod-app.azurewebsites.net/ta/TournamentMatches/?tournamentId=432603",
      {
        headers: {
          accept: "application/json",
        },
        body: null,
        next: {
          revalidate: 720,
        },
      },
    )
    .json<CompanyLeagueTable>();
};

type TeamProps = {
  id: number;
  name: string;
  score: number | null | undefined;
};

const Team = ({ id, name, score }: TeamProps) => {
  return (
    <div className="flex w-full items-center gap-4">
      <div
        className={cn("flex-1 text-sm", {
          "font-medium": id === DATABRUS_FC_ID,
          "text-gray-500": id !== DATABRUS_FC_ID,
        })}
      >
        {name}
      </div>

      <p
        className={cn("text-sm", {
          "font-medium": id === DATABRUS_FC_ID,
          "text-gray-500": id !== DATABRUS_FC_ID,
        })}
      >
        {score ?? "-"}
      </p>
    </div>
  );
};

export const CompanyLeagueBanner = async () => {
  const league = await fetchCompanyLeagueTableMatches();

  return (
    <div className="relative pb-8">
      <Marquee gradient gradientColor="var(--background)">
        {league.matches.map((match) => {
          return (
            <div className="flex flex-col border-r px-8" key={match.matchId}>
              <p className="mb-1 text-xs">{format(new Date(match.matchDate), "dd.MM.yyyy")}</p>

              <div className="flex-center flex gap-8">
                <div className="flex flex-col">
                  <Team
                    id={match.hometeamId}
                    name={match.hometeamOrgName}
                    score={match.matchResult?.homeGoals}
                  />

                  <Team
                    id={match.awayteamId}
                    name={match.awayteamOrgName}
                    score={match.matchResult?.awayGoals}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
};
