
export const registrationStatusToString = {
  registered: "Påmeldt",
  waiting: "Venteliste",
  unregistered: "Avmeldt",
  removed: "Fjernet",
  pending: "Under behandling",
};

export const happeningTypeToString = {
  event: "Arrangement",
  bedpres: "Bedriftspresentasjon",
  external: "Eksternt arrangement",
};

export const happeningTypeToPath = {
  bedpres: "/bedpres",
  event: "/arrangement",
  external: "/arrangement",
};
