/* eslint-disable no-console */
import process from "node:process";

import { db } from "..";
import {
  accounts,
  degrees,
  groups,
  happenings,
  sessions,
  spotRanges,
  users,
  usersToGroups,
  type UserType,
} from "../schemas";

async function seed() {
  await db
    .insert(degrees)
    .values([
      {
        id: "dtek",
        name: "Datateknologi",
      },
      {
        id: "dsik",
        name: "Datasikkerhet",
      },
      {
        id: "dvit",
        name: "Datavitenskap",
      },
      {
        id: "binf",
        name: "Bioinformatikk",
      },
      {
        id: "imo",
        name: "Informatikk-matematikk-økonomi",
      },
      {
        id: "inf",
        name: "Master i informatikk",
      },
      {
        id: "prog",
        name: "Programvareutvikling",
      },
      {
        id: "dsc",
        name: "Master i data science",
      },
      {
        id: "arminf",
        name: "Årsstudium i informatikk",
      },
      {
        id: "post",
        name: "Post-bachelor",
      },
      {
        id: "other",
        name: "Annet",
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(groups)
    .values([
      {
        id: "hovedstyret",
        name: "Hovedstyret",
      },
      {
        id: "webkom",
        name: "Webkom",
      },
      {
        id: "bedkom",
        name: "Bedkom",
      },
      {
        id: "gnist",
        name: "Gnist",
      },
      {
        id: "makerspace",
        name: "Makerspace",
      },
      {
        id: "tilde",
        name: "Tilde",
      },
      {
        id: "hyggkom",
        name: "Hyggkom",
      },
      {
        id: "esc",
        name: "ESC",
      },
      {
        id: "programmerbar",
        name: "Programmerbar",
      },
      {
        id: "esc-squash",
        name: "ESC Squash",
      },
      {
        id: "esc-fotball",
        name: "ESC Fotball",
      },
      {
        id: "bryggelaget",
        name: "Bryggelaget",
      },
    ])
    .onConflictDoNothing();

  await createUser({
    id: "student",
    name: "Student",
    email: "student@echo.uib.no",
    type: "student",
    token: "student",
  });

  await createUser({
    id: "alum",
    name: "Andreas Aanes",
    email: "alum@echo.uib.on",
    type: "alum",
    token: "alum",
  });
  await createUser({
    id: "admin",
    name: "Bo Salhus",
    email: "admin@echo.uib.on",
    type: "student",
    token: "admin",
  });

  await db.insert(usersToGroups).values({
    userId: "admin",
    groupId: "webkom",
    isLeader: true,
  });

  await db
    .insert(happenings)
    .values({
      id: "5cbb5337-a6e6-4eff-a821-a73722594f47",
      slug: "party-med-webkom",
      title: "Party med Webkom",
      date: new Date("2030-01-01"),
      registrationEnd: new Date("2029-12-31"),
      registrationStart: new Date("2024-01-01"),
      type: "event",
    })
    .onConflictDoNothing();

  console.log("Inserted happening Party med Webkom with id 5cbb5337-a6e6-4eff-a821-a73722594f47");

  await db
    .insert(spotRanges)
    .values({
      happeningId: "5cbb5337-a6e6-4eff-a821-a73722594f47",
      id: "party-med-webkom-spotrange",
      maxYear: 5,
      minYear: 1,
      spots: 5,
    })
    .onConflictDoNothing();

  console.log("Inserted spot range for Party med Webkom");
}

async function createUser({
  id,
  name,
  email,
  type,
  token,
  year = 1,
  degreeId = "dtek",
}: {
  id: string;
  name: string;
  email: string;
  type: UserType;
  token: string;
  year?: number;
  degreeId?: string;
}) {
  console.log(`Inserted user ${name} with id ${id}`);
  await db
    .insert(users)
    .values({
      id,
      name,
      email,
      type,
      year,
      degreeId,
    })
    .onConflictDoNothing();

  await db
    .insert(accounts)
    .values({
      userId: id,
      type: "oauth",
      provider: "test",
      providerAccountId: token,
    })
    .onConflictDoNothing();

  await db
    .insert(sessions)
    .values({
      sessionToken: token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      userId: id,
    })
    .onConflictDoNothing();
}

console.log("🌱 Starting seeding...");

void seed()
  .then(() => {
    console.log("✅ Seeded successfully");
    process.exit(0);
  })
  .catch((e) => {
    console.error("🚨 Seeding failed with error:", e);
    process.exit(1);
  });
