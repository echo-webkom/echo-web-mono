// Antall arrangementer per undergruppe
const EVENTS_PER_GROUP = [
  { name: "BEDKOM", events: 30 },
  { name: "WEBKOM", events: 20 },
  { name: "HYGGKOM", events: 50 },
  { name: "TILDE", events: 10 },
  { name: "GNIST", events: 60 },
  { name: "MAKERSPACE", events: 0 },
  { name: "ESC", events: 40 },
];

// Arrangement med flest påmeldinger
const BEST_EVENTS: { name: string; registrations: number }[] = [
  { name: "Vinterball", registrations: 195 },
  { name: "DNB bedpres", registrations: 100 },
  { name: "INF100 kræsjkurs", registrations: 80 },
];

// Kommentar med flest replies
const BEST_COMMENT = {
  name: "webkom er best!",
  replies: 123,
};

const COMMENTS = 1234; // Antall kommentarer totalt 2024
const EVENTS = 1234; // Antall arrangementer totalt 2024
const REACTIONS = 12345; // Antall reaksjoner på arrangement i 2024
const REGISTRATIONS: number = 12345; // Antall påmeldinger på arrangement i 2024
const COFFEE: number = 37338; // Hvor mange kroner vi har brukt på kaffe
const BEER: number = 1234; // Hvor mange øl vi har kjøpt
const RU_MONEY: number = 0; // Hvor mye penger vi har fått av RU
const JOBS: number = 123; // Antall jobbannonser i 2024
const POSTS: number = 123; // Antall innlegg i 2024