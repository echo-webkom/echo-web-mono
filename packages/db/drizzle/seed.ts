/* eslint-disable no-console */
import process from "node:process";

import { db } from "..";
import { accounts, degrees, groups, sessions, users, usersToGroups, type UserType } from "../schemas";

async function seed() {
  await db.insert(degrees).values([
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
  ]).onConflictDoNothing();

  await db.insert(groups).values([
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
  ]).onConflictDoNothing();

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
  })

  await db.insert(usersToGroups).values({
    userId: "admin",
    groupId: "webkom",
    isLeader: true,
  });
}

async function createUser({
  id,
  name,
  email,
  type,
  token,
}: {
  id: string;
  name: string;
  email: string;
  type: UserType;
  token: string;
}) {
  console.log(`Inserted user ${name} with id ${id}`);
  await db.insert(users).values({
    id,
    name,
    email,
    type,
  }).onConflictDoNothing();

  await db.insert(accounts).values({
    userId: id,
    type: "oauth",
    provider: "test",
    providerAccountId: token,
  }).onConflictDoNothing();

  await db.insert(sessions).values({
    sessionToken: token,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    userId: id,
  }).onConflictDoNothing();
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
