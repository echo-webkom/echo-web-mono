import chalk from "chalk";

import { degrees, groups, spotRanges, usersToGroups } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { degrees as defaultDegrees } from "./data/degrees";
import { groups as defaultGroups } from "./data/groups";
import { createRegistrations } from "./data/registrations";
import { createFakeUsers, users as defaultUsers } from "./data/users";
import { type SeedMode } from "./mode";
import * as Happening from "./repo/happening";
import * as User from "./repo/user";

const NOW = new Date();
const FAKE_USER_COUNT = 50;

export type Options = {
  /**
   * What data to seed
   *
   * Default is "dev"
   *
   * "prod": Only seed data that should be in production
   * "dev": Seed data that is useful for development
   * "test": Seed data that is useful for testing
   */
  mode: SeedMode;
};

export const seed = async ({ mode }: Options) => {
  if (mode === "prod") {
    return await seedProd();
  }

  if (mode === "dev") {
    return await seedDev();
  }

  if (mode === "test") {
    return await seedTest();
  }

  throw new Error(`Invalid mode: ${mode}`);
};

const seedProd = async () => {
  console.log(chalk.blue.underline(`🌱 Seeding prod data...`));

  await db.insert(degrees).values(defaultDegrees).onConflictDoNothing();
  await db.insert(groups).values(defaultGroups).onConflictDoNothing();
};

const seedDev = async () => {
  await seedProd();

  console.log(chalk.blue.underline(`🌱 Seeding dev data...`));

  await Promise.all(defaultUsers.map(User.create));

  await db
    .insert(usersToGroups)
    .values({
      userId: "admin",
      groupId: "webkom",
      isLeader: true,
    })
    .onConflictDoNothing();

  await db
    .insert(usersToGroups)
    .values({
      userId: "admin",
      groupId: "bedkom",
      isLeader: true,
    })
    .onConflictDoNothing();

  await db
    .insert(usersToGroups)
    .values({
      userId: "hyggkom",
      groupId: "hyggkom",
      isLeader: true,
    })
    .onConflictDoNothing();

  await createFakeUsers(FAKE_USER_COUNT);
};

/**
 * Seed registrations for fake users.
 * Must be called after Sanity happenings have been synced to the DB.
 */
export const seedRegistrations = async () => {
  console.log(chalk.blue.underline(`🌱 Seeding registrations...`));
  await createRegistrations(FAKE_USER_COUNT);
};

const seedTest = async () => {
  await seedDev();

  console.log(chalk.blue.underline(`🌱 Seeding test data...`));

  await Happening.create({
    id: "5cbb5337-a6e6-4eff-a821-a73722594f47",
    slug: "test-i-prod-med-webkom",
    title: "Test i prod med Webkom!",
    date: new Date("2030-01-01"),
    registrationEnd: new Date("2029-12-31"),
    registrationStart: new Date("2024-01-01"),
    type: "event",
  });

  await Happening.create({
    id: "f707bdb8-817d-40ae-a3f0-745bc344c14e",
    slug: "tidligere-bedpres",
    title: "Tidligere bedpres!",
    date: new Date(NOW.getTime() - 24 * 60 * 60 * 1000), // 24h ago
    registrationEnd: new Date(NOW.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    registrationStart: new Date(NOW.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    type: "bedpres",
  });

  await db
    .insert(spotRanges)
    .values({
      happeningId: "5cbb5337-a6e6-4eff-a821-a73722594f47",
      id: "test-i-prod-med-webkom-spotrange",
      minYear: 1,
      maxYear: 3,
      spots: 1,
    })
    .onConflictDoNothing();

  console.log("Inserted spot range for Test i prod med Webkom");
};
