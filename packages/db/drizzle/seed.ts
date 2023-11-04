/* eslint-disable no-console */
import { db } from "..";
import { degrees, groups } from "../schemas";

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
