import { type getFullHappening } from "@/data/happenings/queries";
import { DownloadCsvButton } from "../_components/download-csv-button";
import { RandomPersonButton } from "../_components/random-person-button";
import { RemoveAllRegistrationsButton } from "../_components/remove-all-registrations-button";
import { type RegistrationWithUser } from "../_lib/types";

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4 rounded-lg border bg-muted p-4">{children}</div>
);

const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground">{children}</p>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-medium">{children}</h2>
);

type UtilitiesTabProps = {
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  registrations: Array<RegistrationWithUser>;
};

export const UtilitiesTab = ({ happening, registrations }: UtilitiesTabProps) => {
  const filteredRegistrations = registrations
    .filter((r) => r.status === "registered")
    .map((r) => r.user.name ?? r.user.email);

  return (
    <div className="mt-8 flex max-w-screen-md flex-col justify-between gap-6">
      <Heading>Generelt</Heading>

      <Box>
        <RandomPersonButton registrations={filteredRegistrations} />

        <Text>
          Velg en tilfeldig person fra listen over påmeldte. Dette kan være nyttig for å trekke
          vinnere av premier eller lignende.
        </Text>
      </Box>

      <Box>
        <DownloadCsvButton questions={happening.questions} slug={happening.slug} />

        <Text>
          Last ned alle påmeldinger til arrangementet som en CSV-fil. Filen inneholder navn, e-post
          og svar på spørsmålene som er stilt i påmeldingsskjemaet.
        </Text>
      </Box>

      <Heading>Farlig</Heading>

      <Box>
        <RemoveAllRegistrationsButton slug={happening.slug} />

        <Text>
          Slett alle påmeldinger fra arrangementet. Dette kan ikke angres. Vær sikker på at du vil
          slette alle påmeldinger før du trykker på knappen.
        </Text>
      </Box>
    </div>
  );
};
