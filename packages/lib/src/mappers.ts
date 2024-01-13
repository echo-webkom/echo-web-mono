import { type HappeningType, type RegistrationStatus } from "@echo-webkom/db/schemas";

export const registrationStatusToString: Record<RegistrationStatus, string> = {
  registered: "Påmeldt",
  waiting: "Venteliste",
  unregistered: "Avmeldt",
  removed: "Fjernet",
  pending: "Under behandling",
};

export const happeningTypeToString: Record<HappeningType, string> = {
  event: "Arrangement",
  bedpres: "Bedriftspresentasjon",
  external: "Eksternt arrangement",
};

export const happeningTypeToPathname: Record<HappeningType, string> = {
  bedpres: "bedpres",
  event: "arrangement",
  external: "arrangement",
};
