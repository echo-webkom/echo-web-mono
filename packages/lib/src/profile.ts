import {type Degree, type Group, type RegistrationStatus} from "@echo-webkom/db/types";

export const degreeToString: Record<Degree, string> = {
  DTEK: "Datateknologi",
  DSIK: "Datasikkerhet",
  DVIT: "Datavitenskap",
  IMO: "Informatikk-matematikk-økonomi",
  BINF: "Bioinformatikk",
  ARMNINF: "Årstudium i informatikk",
  DSC: "Master i datascience",
  INF: "Master i informatikk",
  POST: "Post-bachelor",
  MISC: "Annet",
  PROG: "Programvareutvikling",
};

export const yearToString: Record<number, string> = {
  1: "1. året",
  2: "2. året",
  3: "3. året",
  4: "4. året",
  5: "5. året",
};

export const registrationStatusToString: Record<RegistrationStatus, string> = {
  REGISTERED: "Påmeldt",
  WAITLISTED: "Venteliste",
  DEREGISTERED: "Avmeldt",
};

export const groupToString: Record<Group, string> = {
  BEDKOM: "Bedkom",
  BOARD: "Hovedstyret",
  ESC: "ESC",
  HYGGKOM: "Hyggkom",
  GNIST: "Gnist",
  MAKERSPACE: "Makerspace",
  WEBKOM: "Webkom",
  SQUASH: "echo Squash",
  PROGBAR: "Programmerbar",
  TILDE: "Tilde",
};
