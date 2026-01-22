import Link from "next/link";
import { format } from "date-fns";
import ky from "ky";
import Marquee from "react-fast-marquee";

import { cn } from "@/utils/cn";

const DATABRUS_FC = "Databrus FC";

export type MatchType = "upcoming" | "previous";

export interface Match {
  type: MatchType;
  id: string;
  homeTeam: string;
  awayTeam: string;
  datetime: string;
  homeScore: string | null;
  awayScore: string | null;
}

const fetchCompanyLeagueTableMatches = async () => {
  return await ky
    .get("https://databrus.echo-webkom.no/matches", {
      headers: {
        accept: "application/json",
      },
      body: null,
      next: {
        revalidate: 720,
      },
    })
    .json<Array<Match>>();
};

type TeamProps = {
  name: string;
  score: string | null;
  outcome: "win" | "loss" | "draw" | null;
};

const Team = ({ name, score, outcome }: TeamProps) => {
  return (
    <div
      className={cn("flex w-full items-center gap-4 border-l-2", {
        "border-green-500": outcome === "win",
        "border-red-500": outcome === "loss",
        "border-orange-500": outcome === "draw",
        "border-gray-500": outcome === null,
      })}
    >
      <div
        className={cn("flex-1 pl-2 text-sm", {
          "font-medium": name === DATABRUS_FC,
          "text-gray-500": name !== DATABRUS_FC,
        })}
      >
        {name}
      </div>

      <p
        className={cn("text-sm", {
          "font-medium": name === DATABRUS_FC,
          "text-gray-500": name !== DATABRUS_FC,
        })}
      >
        {score ?? "-"}
      </p>
    </div>
  );
};

const getOutcome = (home: string | null, away: string | null) => {
  if (home === null || away === null) return null;

  const homeScore = parseInt(home);
  const awayScore = parseInt(away);

  if (homeScore > awayScore) return "win";
  if (homeScore < awayScore) return "loss";
  return "draw";
};

type CompanyLeagueBannerProps = {
  linkToDatabrusPage?: boolean;
};

export const CompanyLeagueBanner = async ({
  linkToDatabrusPage = false,
}: CompanyLeagueBannerProps) => {
  const matches = await fetchCompanyLeagueTableMatches().then((ms) =>
    ms.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()),
  );

  const content = (
    <div className="relative pb-8">
      <Marquee gradient gradientColor="var(--background)">
        {matches.map((match) => {
          const homeOutcome = getOutcome(match.homeScore, match.awayScore);
          const awayOutcome = getOutcome(match.awayScore, match.homeScore);

          return (
            <div className="relative flex flex-col px-8" key={match.id}>
              <p className="mb-1 text-xs">{format(new Date(match.datetime), "dd.MM.yyyy")}</p>

              <div className="flex-center flex gap-8">
                <div className="flex flex-col">
                  <Team name={match.homeTeam} score={match.homeScore} outcome={homeOutcome} />

                  <Team name={match.awayTeam} score={match.awayScore} outcome={awayOutcome} />
                </div>
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  );

  if (linkToDatabrusPage) {
    return (
      <Link href="/databrus" className="block transition-opacity hover:opacity-80">
        {content}
      </Link>
    );
  }

  return content;
};
