import { readFileSync } from "fs";
import { join } from "path";

import DagensOrd from "./_components/dagens-ord";

export default function DagensOrdPage() {
  const file = readFileSync(
    join(process.cwd(), "src/app/(default)/for-studenter/dagens-ord/words.txt"),
    "utf-8",
  );
  const words = seededShuffle(file.split("\n").filter(Boolean), 42);
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const solution = words[dayIndex % words.length] ?? "skole";

  return <DagensOrd solution={solution} />;
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
