// Antall arrangementer per undergruppe
export const EVENTS_PER_GROUP = [
  { name: "BEDKOM", events: 30 },
  { name: "WEBKOM", events: 20 },
  { name: "HYGGKOM", events: 50 },
  { name: "TILDE", events: 10 },
  { name: "GNIST", events: 60 },
  { name: "MAKERSPACE", events: 0 },
  { name: "ESC", events: 40 },
].sort((a, b) => (a.events > b.events ? -1 : 1));

/**
 * select
 *   h.title,
 *   count(*) as count
 * from
 *   registration as r
 *   join happening as h on r.happening_id = h.id
 * where
 *   r.status = 'registered'
 *   and h.date >= '2024-01-01'
 *   and h.date < '2025-01-01'
 * group by
 *   r.happening_id,
 *   h.title
 * order by
 *   count desc
 * limit
 *   9;
 */
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
  name: "webkom er best!",
  replies: 123,
};

export const COMMENTS = 1234; // Antall kommentarer totalt 2024
export const REPLIES = 234; // Antall svar på kommentarer
export const EVENTS = 1234; // Antall arrangementer totalt 2024
export const REACTIONS = 12345; // Antall reaksjoner på arrangement i 2024
export const REGISTRATIONS = 12345; // Antall påmeldinger på arrangement i 2024
export const COFFEE = 37338; // Hvor mange kroner vi har brukt på kaffe
export const BEER = 1234; // Hvor mange øl vi har kjøpt
export const RU_MONEY = 0; // Hvor mye penger vi har fått av RU
export const JOBS = 123; // Antall jobbannonser i 2024
export const POSTS = 123; // Antall innlegg i 2024

export const TOTAL_USERS = 1000;
export const NEW_USERS = 100;

export const YOUR_COMMENTS = 2;
export const YOUR_REPLIES = 1;
export const YOUR_REACTIONS = 7;
