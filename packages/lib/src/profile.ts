import {
  type AccountType,
  type Degree,
  type Group,
  type HappeningType,
  type RegistrationStatus,
} from "@echo-webkom/storage";

export const degreeToString: Record<Degree, string> = {
  dtek: "Datateknologi",
  dsik: "Datasikkerhet",
  dvit: "Datavitenskap",
  imo: "Informatikk-matematikk-økonomi",
  binf: "Bioinformatikk",
  armninf: "Årstudium i informatikk",
  dsc: "Master i datascience",
  inf: "Master i informatikk",
  post: "Post-bachelor",
  misc: "Annet",
  prog: "Programvareutvikling",
};

export const yearToString: Record<number, string> = {
  1: "1. året",
  2: "2. året",
  3: "3. året",
  4: "4. året",
  5: "5. året",
};

export const registrationStatusToString: Record<RegistrationStatus, string> = {
  registered: "Påmeldt",
  waiting: "Venteliste",
  unregistered: "Avmeldt",
  removed: "Fjernet",
};

export const happeningTypeToString: Record<HappeningType, string> = {
  event: "Arrangement",
  bedpres: "Bedriftspresentasjon",
};

export const happeningTypeToPath: Record<HappeningType, string> = {
  bedpres: "/bedpres",
  event: "/event",
};

export const groupToString: Record<Group, string> = {
  bedkom: "Bedkom",
  board: "Hovedstyret",
  esc: "ESC",
  hyggkom: "Hyggkom",
  gnist: "Gnist",
  makerspace: "Makerspace",
  webkom: "Webkom",
  squash: "echo Squash",
  progbar: "Programmerbar",
  tilde: "Tilde",
};

export const accountTypeToString: Record<AccountType, string> = {
  admin: "Administrator",
  company: "Bedrift",
  guest: "Gjest",
  student: "Student",
};
