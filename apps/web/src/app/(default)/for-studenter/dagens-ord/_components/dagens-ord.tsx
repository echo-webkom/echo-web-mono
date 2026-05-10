"use client";

import { useEffect, useState } from "react";

import ConfettiForBDay from "../../../hjem/_components/confetti";
import { validWord } from "../_actions/validere-ord";
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

  //Spillogikk
  useEffect(() => {
    if (win) {
      return;
    }
    const handeKeyPressed = async (event: KeyboardEvent) => {
      if (event.key === "Enter" && currentAttempt.length === 5) {
        const isValid = await validWord(currentAttempt);
        if (!isValid) {
          setIsValidWord(false);
          return;
        }

        setAttmpts(attempts.map((a, i) => (i === currentRow ? currentAttempt : a)));
        setCurrentRow(currentRow + 1);
        setCurrentAttemt("");
        setIsValidWord(true);
        if (solution === currentAttempt) {
          setWin(true);
        } else if (currentRow === 5) {
          setLoss(true);
          return;
        }
      } else if (event.key === "Backspace") {
        setCurrentAttemt(currentAttempt.slice(0, -1));
      } else if (/^[a-zA-ZæøåÆØÅ]$/.test(event.key) && currentAttempt.length < 5) {
        setCurrentAttemt(currentAttempt + event.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handeKeyPressed);

    return () => window.removeEventListener("keydown", handeKeyPressed);
  }, [currentAttempt, currentRow, attempts, win, solution]);

  return (
    <>
      {win && <ConfettiForBDay />}
      <h1 className="self-center p-3 text-4xl">Dagens ord</h1>
      {!isVaildWord && (
        <p className="self-center p-3 text-2xl font-bold">Ordet er ikke i listen, prøv igjen</p>
      )}

      <div>
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
      {loss && <p className="self-center text-2xl font-bold">{`Korrekt ord var ${solution}`}</p>}
    </>
  );
}
