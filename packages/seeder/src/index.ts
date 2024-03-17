import process from "node:process";

import * as Database from "./db";
import * as Sanity from "./sanity";

const main = async () => {
  console.log("🌱 Starting seeding...");

  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--database")) {
    await Database.seed();
  }

  if (args.length === 0 || args.includes("--sanity")) {
    await Sanity.seed();
  }
};

main()
  .then(() => {
    console.log("🌱 Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("🔥 Seeding failed with error:", error);
    process.exit(1);
  });
