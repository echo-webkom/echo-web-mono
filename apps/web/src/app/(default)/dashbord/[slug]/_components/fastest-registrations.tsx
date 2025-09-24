import { type getFullHappening } from "@/data/happenings/queries";
import { getFullNorwegianDate } from "@/utils/date";
import { type RegistrationWithUser } from "../_lib/types";
import { Box } from "./box";

type FastestRegistrationsProps = {
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  registrations: Array<RegistrationWithUser>;
};

export const FastestRegistrations = ({ happening, registrations }: FastestRegistrationsProps) => {
  const fastestRegistrations = registrations
    .filter((registration) => registration.status === "registered")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const topThree = fastestRegistrations.slice(0, 3);

  return (
    <Box>
      <ul className="mt-2 px-4">
        <li>
          Påmelding for grupper åpnet:{" "}
          <span className="text-muted-foreground">
            {happening.registrationStartGroups
              ? getFullNorwegianDate(happening.registrationStartGroups)
              : "Ingen påmelding for grupper"}
          </span>
        </li>
        <li>
          Påmelding for alle åpnet:{" "}
          <span className="text-muted-foreground">
            {happening.registrationStart
              ? getFullNorwegianDate(happening.registrationStart)
              : "Ingen påmelding for alle"}
          </span>
        </li>
      </ul>

      <ul className="space-y-2 px-4">
        {topThree.map((registration, i) => {
          const createdAtMs = registration.createdAt.getTime();
          const normalStartMs = happening.registrationStart!.getTime();
          const groupStartMs = happening.registrationStartGroups?.getTime();

          let ms = createdAtMs - normalStartMs;
          if (ms < 0 && groupStartMs) {
            ms = createdAtMs - groupStartMs;
          }

          return (
            <li className="flex flex-col justify-between sm:flex-row" key={registration.user.id}>
              <p>
                <span className="text-muted-foreground">{i + 1}.</span> {registration.user.name}
              </p>
              <p className="text-muted-foreground text-sm">{(ms / 1000).toFixed(2)} sekunder</p>
            </li>
          );
        })}
      </ul>

      <p className="text-muted-foreground mt-2 px-4 text-sm">
        Om det er negativt tall, så har brukeren meldt seg på før påmeldingen åpnet. Dette kan
        skyldes at de har blitt lagt til manuelt, eller at påmeldingsdatoen har blitt endret etter
        at de meldte seg på.
      </p>
    </Box>
  );
};
