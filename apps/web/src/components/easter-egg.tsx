"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";

const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const sixtySevenCode = ["6", "7"];

export const EasterEgg = () => {
  const [keys, setKeys] = useState<Array<string>>([]);
  const [show67, setShow67] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => [...prev, e.key].slice(-konamiCode.length));
    };

    const onAction = (e: Event) => {
      if ((e as CustomEvent).detail === "sixty-seven") {
        setShow67(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("easter-egg-action", onAction);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("easter-egg-action", onAction);
    };
  }, []);

  const onTyping = useEffectEvent(() => {
    if (keys.join() === konamiCode.join()) {
      router.push("/webkom");
    }

    const lastTwo = keys.slice(-sixtySevenCode.length);
    if (lastTwo.join() === sixtySevenCode.join()) {
      setShow67(true);
      setTimeout(() => setShow67(false), 3000);
    }
  });

  useEffect(() => {
    onTyping();
  }, [keys]);

  useEffect(() => {
    if (!show67) return;

    document.body.classList.add("sixty-seven-twist");
    const timer = setTimeout(() => {
      document.body.classList.remove("sixty-seven-twist");
      setShow67(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("sixty-seven-twist");
    };
  }, [show67]);

  return (
    <style>{`
      @keyframes sixtySevenTwist {
        0%   { transform: rotate(0deg); }
        10%  { transform: rotate(-6deg); }
        20%  { transform: rotate(6deg); }
        30%  { transform: rotate(-6deg); }
        40%  { transform: rotate(6deg); }
        50%  { transform: rotate(-6deg); }
        60%  { transform: rotate(6deg); }
        70%  { transform: rotate(-6deg); }
        80%  { transform: rotate(6deg); }
        90%  { transform: rotate(-3deg); }
        100% { transform: rotate(0deg); }
      }
      .sixty-seven-twist {
        animation: sixtySevenTwist 3s ease-in-out forwards;
        transform-origin: center center;
      }
    `}</style>
  );
};
