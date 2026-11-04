"use client";

import { useCallback, useEffect, useState } from "react";

import ConfettiForBDay from "../../../../hjem/_components/confetti";
import { validWord } from "../_actions/validere-ord";
import Keyboard from "./keyboard";
import Row from "./row";

export default function DagensOrd({ solution }: { solution: string }) {
  const [loss, setLoss] = useState(false);
  const [attempts, setAttmpts] = useState(Array(6).fill(""));
  const [currentAttempt, setCurrentAttemt] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [win, setWin] = useState(false);
  const [isVaildWord, setIsValidWord] = useState(true);

  // Last lagret state ved oppstart
  useEffect(() => {
    const saved = localStorage.getItem("dagens-ord");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === new Date().toDateString()) {
        setAttmpts(data.attempts);
        setCurrentRow(data.currentRow);
        setWin(data.win);
        setLoss(data.loss);
      }
    }
  }, []);

  // Lagre state etter hvert forsøk
  useEffect(() => {
    if (currentRow > 0 || win || loss) {
      localStorage.setItem(
        "dagens-ord",
        JSON.stringify({
          date: new Date().toDateString(),
          attempts,
          currentRow,
          win,
          loss,
        }),
      );
    }
  }, [attempts, currentRow, win, loss]);

  // Felles inndata-håndterer for både fysisk og virtuelt tastatur
  const handleKeyInput = useCallback(
    async (key: string) => {
      if (win || loss) return;

      const upperKey = key.toUpperCase();

      if (upperKey === "ENTER") {
        if (currentAttempt.length === 5) {
          const isValid = await validWord(currentAttempt);
          if (!isValid) {
            setIsValidWord(false);
            return;
          }

          setAttmpts(attempts.map((a, i) => (i === currentRow ? currentAttempt : a)));
          setCurrentRow(currentRow + 1);
          setCurrentAttemt("");
          setIsValidWord(true);

          if (solution.toLowerCase() === currentAttempt.toLowerCase()) {
            setWin(true);
          } else if (currentRow === 5) {
            setLoss(true);
          }
        }
      } else if (upperKey === "BACKSPACE" || upperKey === "DELETE") {
        setCurrentAttemt((prev) => prev.slice(0, -1));
        setIsValidWord(true);
      } else if (/^[a-zA-ZæøåÆØÅ]$/.test(key) && currentAttempt.length < 5) {
        setCurrentAttemt((prev) => prev + key.toLowerCase());
        setIsValidWord(true);
      }
    },
    [currentAttempt, attempts, currentRow, win, loss, solution],
  );

  // Lytter på fysisk tastatur
  useEffect(() => {
    const handleKeyPressed = (event: KeyboardEvent) => {
      handleKeyInput(event.key);
    };

    window.addEventListener("keydown", handleKeyPressed);
    return () => window.removeEventListener("keydown", handleKeyPressed);
  }, [handleKeyInput]);

  return (
    <div className="inline-flex w-full sm:w-2/3 flex-col self-center items-center rounded-3xl border-2 border-gray-300 px-4 pt-3 pb-5 shadow-lg sm:px-8 sm:pt-4 sm:pb-6 dark:border-gray-600 dark:bg-gray-900">
      {win && <ConfettiForBDay />}
      <h1 className="self-center text-2xl font-bold tracking-tight sm:p-3 sm:text-4xl">
        Dagens ord
      </h1>

      <div className="flex h-12 items-center justify-center">
  {!isVaildWord && (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-1.5 text-base font-semibold text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
      Ordet er ikke i listen, prøv igjen
    </p>
  )}
  {loss && (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-1.5 text-lg font-bold text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
      {`Korrekt ord var ${solution}`}
    </p>
  )}
</div>

      <div className="my-2">
        {attempts.map((attempt, index) => {
          const isCuurentAttempt = index === currentRow;
          return (
            <Row
              key={index}
              attempt={isCuurentAttempt ? currentAttempt : attempt}
              solution={solution}
              submitted={index < currentRow || win}
            />
          );
        })}
      </div>

      {loss && (
        <p className="my-2 self-center text-2xl font-bold text-red-600">
          {`Korrekt ord var ${solution}`}
        </p>
      )}

      {/* Skjermtastatur */}
      <Keyboard
        attempts={attempts}
        currentRow={currentRow}
        solution={solution}
        onKeyPress={handleKeyInput}
      />
    </div>
  );
}
