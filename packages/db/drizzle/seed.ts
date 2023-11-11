/* eslint-disable no-console */
import process from "node:process";

import { db } from "..";
import { accounts, degrees, groups, sessions, users, type UserType } from "../schemas";

async function seed() {
  await db.insert(degrees).values([
    {
      name: "Datateknologi",
    },
    {
      name: "Datasikkerhet",
    },
    {
      name: "Datavitenskap",
    },
    {
      name: "Bioinformatikk",
    },
    {
      name: "Informatikk-matematikk-økonomi",
    },
    {
      name: "Master i informatikk",
    },
    {
      name: "Programvareutvikling",
    },
    {
      name: "Master i data science",
    },
    {
      name: "Årsstudium i informatikk",
    },
    {
      name: "Post-bachelor",
    },
    {
      name: "Annet",
    },
  ]);

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
  ]);

  await createUser({
    id: "student",
    name: "Student",
    email: "student@echo.uib.no",
    type: "student",
    token: "student",
  });

  await createUser({
    id: "admin",
    name: "Andreas Aanes",
    email: "admin@echo.uib.on",
    type: "admin",
    token: "admin",
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
  });

  await db.insert(accounts).values({
    userId: id,
    type: "oauth",
    provider: "test",
    providerAccountId: token,
  });

  await db.insert(sessions).values({
    sessionToken: token,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    userId: id,
  });
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
