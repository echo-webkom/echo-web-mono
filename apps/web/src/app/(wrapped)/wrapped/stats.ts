// Antall arrangementer per undergruppe
export const EVENTS_PER_GROUP = [
  { name: "BEDKOM", events: 27 },
  { name: "WEBKOM", events: 4 },
  { name: "HYGGKOM", events: 19 },
  { name: "TILDE", events: 19 },
  { name: "GNIST", events: 41 },
  { name: "MAKERSPACE", events: 4 },
  { name: "ESC", events: 28 },
  { name: "Hovedstyret", events: 10 },
  { name: "Brettspill", events: 35 },
  { name: "Filmklubben", events: 36 },
  { name: "BLDL", events: 1 },
].sort((a, b) => (a.events > b.events ? -1 : 1));

export const TOP_10_EVENTS = [
  { name: "🥂 Vinterball 2025 🥂", registrations: 189 }, // Disse tallene er fra gamle DB.
  {
    name: "DNB",
    registrations: 129,
  },
  {
    name: "Kræsjkurs i MNF130 med Gnist ✨",
    registrations: 128,
  },
  {
    name: "Båttur",
    registrations: 107,
  },
  {
    name: "Infomøte nye studenter!",
    registrations: 97,
  },
  {
    name: "INF102 Kræsjkurs med Gnist✨",
    registrations: 91,
  },
  {
    name: "Git Kræsjkurs 💻",
    registrations: 86,
  },
  {
    name: "Norges Bank",
    registrations: 82,
  },
  {
    name: "echoquiz",
    registrations: 74,
  },
  {
    name: "Kræsjkurs i INF115 med Gnist✨",
    registrations: 73,
  },
];

// Kommentar med flest replies
export const BEST_COMMENT = {
  name: "12:00:20 og den var full haha",
  replies: 5,
};

export const COMMENTS = 107; // Antall kommentarer totalt 2024
export const REPLIES = 57; // Antall svar på kommentarer
export const EVENTS = EVENTS_PER_GROUP.reduce((acc, curr) => curr.events + acc, 0); // Antall arrangementer totalt 2024
export const REACTIONS = 1865; // Antall reaksjoner på arrangement i 2024
export const REGISTRATIONS = 5040; // Antall påmeldinger på arrangement i 2024

// TODO
export const COFFEE = 37338; // Hvor mange kroner vi har brukt på kaffe
export const BEER = 1234; // Hvor mange øl vi har kjøpt

// Pizza på det møtet vi herpa
export const RU_MONEY = -1500; // Hvor mye penger vi har fått av RU

export const JOBS = 17; // Antall jobbannonser i 2024
export const POSTS = 22; // Antall innlegg i 2024

export const TOTAL_USERS = 789;
export const NEW_USERS = 453;

// TOOD: Gjøre de dynamisk
export const YOUR_COMMENTS = 2;
export const YOUR_REPLIES = 1;
export const YOUR_REACTIONS = 7;
