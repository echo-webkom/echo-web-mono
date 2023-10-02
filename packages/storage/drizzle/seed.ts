import "dotenv/config";

import bcrypt from "bcrypt";

import { slugify } from "../../../apps/api/src/lib/slugify";
import { db } from "../src/db/drizzle";
import { happenings, passwords, questions, spotRanges, users } from "../src/db/schemas";

const date = new Date();
date.setDate(new Date().getDate() + 5);
date.setHours(19, 0, 0, 0);

async function seed() {
  /**
   * Insert happenings
   */
  await db.insert(happenings).values([
    {
      slug: slugify("My first happening"),
      title: "My first happening",
      type: "bedpres",
      date,
    },
    {
      slug: slugify("Workshop med Webkom"),
      title: "Workshop med Webkom",
      type: "bedpres",
      date,
    },
  ]);

  /**
   * Insert spot ranges for happenings
   */
  await db.insert(spotRanges).values([
    {
      spots: 10,
      minYear: "first",
      maxYear: "second",
      happeningSlug: slugify("My first happening"),
    },
    {
      spots: 40,
      minYear: "fourth",
      maxYear: "fifth",
      happeningSlug: slugify("My first happening"),
    },
    {
      spots: 40,
      minYear: "first",
      maxYear: "fifth",
      happeningSlug: slugify("Workshop med Webkom"),
    },
  ]);

  /**
   * Insert questions for happenings
   */
  await db.insert(questions).values([
    {
      title: "Hva er ditt favorittspråk?",
      type: "text",
      happeningSlug: slugify("My first happening"),
    },
    {
      title: "Hvilken pizza vil du ha?",
      type: "radio",
      options: [
        {
          label: "Pepperoni",
          value: "pepperoni",
        },
        {
          label: "Hawaii",
          value: "hawaii",
        },
      ],
      happeningSlug: slugify("My first happening"),
    },
  ]);

  /**
   * Insert users
   */
  await db.insert(users).values([
    {
      id: "00000000-0000-0000-0000-000000000000",
      firstName: "Bo",
      lastName: "Salhus",
      email: "bo.salhus@uib.no",
      type: "student",
      degree: "dtek",
      year: "first",
    },
    {
      id: "00000000-0000-0000-0000-000000000001",
      firstName: "Andreas",
      lastName: "Aanes",
      email: "andreas.aanes@uib.no",
      type: "student",
      degree: "dtek",
      year: "fourth",
    },
  ]);

  /**
   * Insert passwords for users
   */
  await db.insert(passwords).values([
    {
      password: bcrypt.hashSync("password", 12),
      userId: "00000000-0000-0000-0000-000000000000",
    },
    {
      password: bcrypt.hashSync("password", 12),
      userId: "00000000-0000-0000-0000-000000000001",
    },
  ]);
}

seed()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("🌱 Done seeding.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("🚨 Seeding failed! Error:", err);
    process.exit(1);
  });
