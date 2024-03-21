import chalk from "chalk";

export const complete = () => {
  console.log(chalk.green.underline(`🌱 Seeding complete!`));
};

export const start = () => {
  console.log(chalk.blue.underline(`🌱 Seeding started...`));
};

export const lines = (n = 8) => {
  console.log("\n".repeat(n));
};
