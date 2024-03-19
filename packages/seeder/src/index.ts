import { Command } from "commander";

import * as Database from "./db";
import { isSeedMode } from "./db/mode";
import * as Sanity from "./sanity";
import * as message from "./utils";

const program = new Command();

program.name("seeder").version("0.0.1");

/**
 * Seed all data
 */
type AllOptions = SanityOptions & DatabaseOptions;

program
  .command("all")
  .description("Seed all data")
  .option("-d, --dataset <dataset>", "Sanity dataset", "production")
  .option("-m, --mode <mode>", "What data to seed", "dev")
  .action(async (options: AllOptions) => {
    if (!isSeedMode(options.mode)) {
      throw new Error(`Invalid mode: ${options.mode}`);
    }

    await Database.seed({ mode: options.mode });
    await Sanity.seed();

    message.complete();
    process.exit(0);
  });

/**
 * Seed sanity data
 */
type SanityOptions = {
  dataset: string;
};

program
  .command("sanity")
  .description("Sync data from Sanity to database")
  .option("-d, --dataset <dataset>", "Sanity dataset")
  .action(async (_options: SanityOptions) => {
    await Sanity.seed();

    message.complete();
    process.exit(0);
  });

/**
 * Seed database data
 */
type DatabaseOptions = {
  mode: string;
};

program
  .command("database")
  .description("Seed database")
  .option("-m, --mode <mode>", "What data to seed")
  .action(async (options: DatabaseOptions) => {
    if (!isSeedMode(options.mode)) {
      throw new Error(`Invalid mode: ${options.mode}`);
    }

    await Database.seed({ mode: options.mode });

    message.complete();
    process.exit(0);
  });

program.parse(process.argv);
