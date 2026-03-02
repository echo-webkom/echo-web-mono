// Antall arrangementer per undergruppe
export const EVENTS_PER_GROUP = [
  { name: "BEDKOM", events: 21 },
  { name: "WEBKOM", events: 3 },
  { name: "HYGGKOM", events: 23 },
  { name: "TILDE", events: 25 },
  { name: "GNIST", events: 42 },
  { name: "ESC", events: 63 },
  { name: "Hovedstyret", events: 9 },
  { name: "Filmklubben", events: 20 },
  { name: "Instituttet", events: 8 },
  { name: "Programmerbar", events: 6 },
  { name: "echo Hay Day 🌽", events: 1 },
  { name: "echo Royale 👑", events: 1 },
].sort((a, b) => (a.events > b.events ? -1 : 1));

export const TOP_10_EVENTS = [
  {
    name: "🥂 Vinterball 2025 🥂",
    registrations: 202,
  },
  {
    name: "DNB bedpres",
    registrations: 199,
  },
  {
    name: "Infomøte for nye studenter med echo!",
    registrations: 106,
  },
  {
    name: "💻 Git(graf)-kræsjkurs 2025",
    registrations: 100,
  },
  {
    name: "Bekk",
    registrations: 99,
  },
  {
    name: "echo teambuilding",
    registrations: 81,
  },
  {
    name: "Kræsjkurs i MNF130 med Gnist✨",
    registrations: 74,
  },
  {
    name: "Generalforsamling 2025",
    registrations: 71,
  },
  {
    name: "Bedriftstur til Oslo!",
    registrations: 70,
  },
  {
    name: "Kræsjkurs i INF140 med Gnist✨",
    registrations: 70,
  },
];

// Kommentar med flest replies
export const BEST_COMMENT = {
  name: "Hei",
  replies: 114,
};

export const COMMENTS = 112; // Antall kommentarer totalt 2025
export const REPLIES = 174; // Antall svar på kommentarer
export const EVENTS = EVENTS_PER_GROUP.reduce((acc, curr) => curr.events + acc, 0); // Antall arrangementer totalt 2024
export const REACTIONS = 1848; // Antall reaksjoner på arrangement i 2025
export const REGISTRATIONS = 4096; // Antall påmeldinger på arrangement i 2025

// TODO
export const COFFEE = 22000; // Hvor mange kopper kaffe 2025

export const BEER = 2600; // Antall liter solgt. Så antall øl vil være ca dobbelt + litt mer.

// // Pizza på det møtet vi herpa
// export const RU_MONEY = -1500; // Hvor mye penger vi har fått av RU

export const JOBS = 16; // Antall jobbannonser 2025
export const POSTS = 19; // Antall innlegg 2025

export const TOTAL_USERS = 1038;
export const NEW_USERS = 266;
