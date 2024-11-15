// Antall arrangementer per undergruppe
export const EVENTS_PER_GROUP = [
  { name: "BEDKOM", events: 30 },
  { name: "WEBKOM", events: 20 },
  { name: "HYGGKOM", events: 50 },
  { name: "TILDE", events: 10 },
  { name: "GNIST", events: 60 },
  { name: "MAKERSPACE", events: 0 },
  { name: "ESC", events: 40 },
].sort((a, b) => a.events > b.events ? -1 : 1);

// Arrangement med flest påmeldinger
export const BEST_EVENTS: { name: string; registrations: number }[] = [
  { name: "Vinterball", registrations: 195 },
  { name: "DNB bedpres", registrations: 100 },
  { name: "INF100 kræsjkurs", registrations: 80 },
];

// Kommentar med flest replies
export const BEST_COMMENT = {
  name: "webkom er best!",
  replies: 123,
};

export const COMMENTS = 1234; // Antall kommentarer totalt 2024
export const REPLIES = 0; // Antall svar på kommentarer
export const EVENTS = 1234; // Antall arrangementer totalt 2024
export const REACTIONS = 12345; // Antall reaksjoner på arrangement i 2024
export const REGISTRATIONS: number = 12345; // Antall påmeldinger på arrangement i 2024
export const COFFEE: number = 37338; // Hvor mange kroner vi har brukt på kaffe
export const BEER: number = 1234; // Hvor mange øl vi har kjøpt
export const RU_MONEY: number = 0; // Hvor mye penger vi har fått av RU
export const JOBS: number = 123; // Antall jobbannonser i 2024
export const POSTS: number = 123; // Antall innlegg i 2024