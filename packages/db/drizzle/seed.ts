/* eslint-disable no-console */
import { db } from "..";
import { accounts, degrees, groups, sessions, users } from "../schemas";

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

  await db.insert(users).values({
    id: "admin",
    name: "Admin",
    email: "admin@echo.uib.no",
    type: "admin",
  });

  await db.insert(accounts).values({
    userId: "admin",
    type: "oauth",
    provider: "test",
    providerAccountId: "test",
  });

  await db.insert(sessions).values({
    sessionToken: "admin",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    userId: "admin",
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
