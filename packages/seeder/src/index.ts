import { Command } from "commander";

import * as Database from "./db";
import { isSeedMode } from "./db/mode";
import * as Sanity from "./sanity";
import { parseEnv } from "./sanity/utils";
import * as message from "./utils";

const program = new Command();

program.name("seeder").version("0.0.1").description("Seed data to database and Sanity");

/**
 * Seed all data
 */
type AllOptions = Sanity.Options & Database.Options;

program
  .command("all")
  .description("Seed all data")
  .option(
    "-d, --dataset <dataset>",
    "Sanity dataset",
    parseEnv(process.env.NEXT_PUBLIC_SANITY_DATASET),
  )
  .option("-m, --mode <mode>", "What data to seed", "dev")
  .action(async (options: AllOptions) => {
    if (!isSeedMode(options.mode)) {
      throw new Error(`Invalid mode: ${options.mode}`);
    }

    message.start();

    await Database.seed({
      mode: options.mode,
    });

    await Sanity.seed({
      dataset: options.dataset,
    });

    message.complete();
    process.exit(0);
  });

/**
 * Seed sanity data
 */
program
  .command("sanity")
  .description("Sync data from Sanity to database")
  .option("-d, --dataset <dataset>", "Sanity dataset")
  .action(async (options: Sanity.Options) => {
    message.start();

    await Sanity.seed(options);

    message.complete();
    process.exit(0);
  });

/**
 * Seed database data
 */
program
  .command("database")
  .description("Seed database")
  .option("-m, --mode <mode>", "What data to seed")
  .action(async (options: Database.Options) => {
    if (!isSeedMode(options.mode)) {
      throw new Error(`Invalid mode: ${options.mode}`);
    }

    message.start();

    await Database.seed({ mode: options.mode });

    message.complete();
    process.exit(0);
  });

let args = process.argv;
if (args.length === 2) {
  args = [...args, "all"];
}

program.parse(args);
