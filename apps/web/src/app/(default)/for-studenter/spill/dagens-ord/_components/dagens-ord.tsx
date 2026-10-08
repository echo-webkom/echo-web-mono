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
    <div className="flex flex-col items-center">
      {win && <ConfettiForBDay />}
      <h1 className="self-center text-2xl font-bold sm:p-3 sm:text-4xl">Dagens ord</h1>

      {!isVaildWord && (
        <p className="self-center p-3 text-xl font-semibold text-red-500">
          Ordet er ikke i listen, prøv igjen
        </p>
      )}

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
