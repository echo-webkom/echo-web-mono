"use client";

import { useCallback, useEffect, useState } from "react";

import ConfettiForBDay from "@/app/(default)/hjem/_components/confetti";
import { validWord } from "@/app/(default)/for-studenter/spill/dagens-ord/_actions/validere-ord";
import Keyboard from "@/app/(default)/for-studenter/spill/dagens-ord/_components/keyboard";
import Row from "@/app/(default)/for-studenter/spill/dagens-ord/_components/row";

interface JuleDagensOrdProps {
  solution: string;
  storageKey: string; // påkrevd, så luka aldri deler lagring med dagens-ord
  title?: string;
  checkDate?: boolean; // false = husk svaret uansett hvilken dag luka åpnes
}

export default function JuleDagensOrd({
  solution,
  storageKey,
  title = "Julewordle",
  checkDate = false,
}: JuleDagensOrdProps) {
  const [loss, setLoss] = useState(false);
  const [attempts, setAttmpts] = useState(Array(6).fill(""));
  const [currentAttempt, setCurrentAttemt] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [win, setWin] = useState(false);
  const [isVaildWord, setIsValidWord] = useState(true);

  // Last lagret state ved oppstart
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      if (!checkDate || data.date === new Date().toDateString()) {
        setAttmpts(data.attempts);
        setCurrentRow(data.currentRow);
        setWin(data.win);
        setLoss(data.loss);
      }
    }
  }, [storageKey, checkDate]);

  // Lagre state etter hvert forsøk
  useEffect(() => {
    if (currentRow > 0 || win || loss) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          date: new Date().toDateString(),
          attempts,
          currentRow,
          win,
          loss,
        }),
      );
    }
  }, [attempts, currentRow, win, loss, storageKey]);

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
    <div className="flex w-full flex-col items-center text-[#8e613c]">
     {win && <ConfettiForBDay />}
      <h1 className="text-center text-xl font-bold text-[#a84d45]">
          {title}
      </h1>

      <div className="flex h-7 items-center justify-center">
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
