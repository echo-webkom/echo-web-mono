import { inArray } from "drizzle-orm";
import { registrations } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { pickRandom } from "../../utils";

// Seed happening IDs (must match _id in sanity fixtures)
const HAPPENING_IDS = [
  "seed-happening-event-1",
  "seed-happening-event-2",
  "seed-happening-event-3",
  "seed-happening-event-4",
  "seed-happening-bedpres-1",
  "seed-happening-bedpres-2",
];

// This event has 5 spots and will be filled first.
// This is we need to ensure that it is always full.
const FULL_HAPPENING_ID = "seed-happening-event-full";
const FULL_HAPPENING_SPOTS = 5;

export const createRegistrations = async (userCount: number) => {
  const fakeUserIds = Array.from({ length: userCount }, (_, i) => `fake-user-${i}`);

  await db.delete(registrations).where(inArray(registrations.userId, fakeUserIds));
  console.log(`Deleted existing registrations for ${fakeUserIds.length} fake users`);

  const values = [];

  // Fill the full event with the first N users
  for (let i = 0; i < FULL_HAPPENING_SPOTS && i < userCount; i++) {
    values.push({
      userId: `fake-user-${i}`,
      happeningId: FULL_HAPPENING_ID,
      status: "registered" as const,
    });
  }

  // Spread remaining users across other happenings
  for (let i = 0; i < userCount; i++) {
    const userId = `fake-user-${i}`;

    const count = pickRandom([1, 2, 3]);
    const shuffled = [...HAPPENING_IDS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    for (const happeningId of selected) {
      values.push({
        userId,
        happeningId,
        status: "registered" as const,
      });
    }
  }

  if (values.length > 0) {
    await db.insert(registrations).values(values).onConflictDoNothing();
    console.log(`Inserted ${values.length} registrations`);
  }
};
