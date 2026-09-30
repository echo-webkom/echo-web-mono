import { readFileSync } from "fs";
import { join } from "path";

import DagensOrd from "./_components/dagens-ord";

let todaysWord = "skole";
let lastUpdated = new Date();
lastUpdated.setDate(lastUpdated.getDate() - 1);

function getTodaysWord() {
  const file = readFileSync(
    join(process.cwd(), "src/app/(default)/for-studenter/dagens-ord/words.txt"),
    "utf-8",
  );
  const words = seededShuffle(file.split("\n").filter(Boolean), 42);
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  return words[dayIndex % words.length] ?? "skole";
}

export default function DagensOrdPage() {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  if (lastUpdated < midnight) {
    todaysWord = getTodaysWord();
    lastUpdated = new Date();
  }

  return <DagensOrd solution={todaysWord} />;
}

function seededShuffle(arr: Array<string>, seed: number) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 16807 + 0) % 2147483647;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}
