"use server";

import { readFileSync } from "fs";
import { join } from "path";

export async function validWord(currentAttempt: string) {
  if (currentAttempt.length !== 5) {
    return;
  }
  const file = readFileSync(
    join(process.cwd(), "src/app/(default)/for-studenter/dagens-ord/words.txt"),
    "utf-8",
  );
  const words = file.split("\n").filter(Boolean);

  return words.includes(currentAttempt);
}
