"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export const EasterEgg = () => {
  const [keys, setKeys] = useState<Array<string>>([]);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
      setKeys((prev) => [...prev, e.key]);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  useEffect(() => {
    if (keys.length > konamiCode.length) {
      setKeys((prev) => prev.slice(keys.length - konamiCode.length));
    }

    if (keys.join() === konamiCode.join()) {
      router.push("/webkom");
    }
  }, [keys]);

  return null;
};
