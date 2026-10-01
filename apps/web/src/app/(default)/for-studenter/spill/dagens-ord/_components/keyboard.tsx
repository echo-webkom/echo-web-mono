"use client";

type KeyStatus = "correct" | "present" | "absent" | "unused";

interface KeyboardProps {
  attempts: Array<string>;
  currentRow: number;
  solution: string;
  onKeyPress: (key: string) => void;
}

const KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ø", "æ"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "BACKSPACE"],
];

// Beregn status for hver bokstav som er gjetter hittil
function getKeyStatuses(attempts: Array<string>, currentRow: number, solution: string) {
  const statuses: Record<string, KeyStatus> = {};
  const sol = solution.toLowerCase();
  const completedAttempts = attempts.slice(0, currentRow);

  completedAttempts.forEach((attempt) => {
    const att = attempt.toLowerCase();
    for (let i = 0; i < att.length; i++) {
      const char = att[i] || "";
      if (sol[i] === char) {
        statuses[char] = "correct";
      } else if (sol.includes(char)) {
        if (statuses[char] !== "correct") {
          statuses[char] = "present";
        }
      } else {
        if (statuses[char] !== "correct" && statuses[char] !== "present") {
          statuses[char] = "absent";
        }
      }
    }
  });

  return statuses;
}

export default function Keyboard({ attempts, currentRow, solution, onKeyPress }: KeyboardProps) {
  const keyStatuses = getKeyStatuses(attempts, currentRow, solution);

  const getKeyStyle = (key: string) => {
    const status = keyStatuses[key.toLowerCase()];

    switch (status) {
      case "correct":
        return "bg-green-600 text-white hover:bg-green-700";
      case "present":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "absent":
        return "bg-zinc-700 text-zinc-400 opacity-60";
      default:
        return "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700";
    }
  };

  return (
    <div className="flex flex-col gap-1.5 my-4 w-full max-w-lg px-2 select-none">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 touch-manipulation">
          {row.map((key) => {
            const isSpecialKey = key === "ENTER" || key === "BACKSPACE";
            const label = key === "BACKSPACE" ? "⌫" : key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKeyPress(key)}
                className={`
                  flex items-center justify-center font-bold uppercase rounded text-sm md:text-base h-14 transition-colors
                  ${isSpecialKey ? "px-2.5 sm:px-4 text-xs sm:text-sm flex-[1.5]" : "flex-1"}
                  ${getKeyStyle(key)}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}