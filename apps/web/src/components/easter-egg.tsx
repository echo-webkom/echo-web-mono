"use client";

import { useEffect, useEffectEvent, useState } from "react";
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
      setKeys((prev) => [...prev, e.key].slice(-konamiCode.length));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onTyping = useEffectEvent(() => {
    if (keys.join() === konamiCode.join()) {
      router.push("/webkom");
    }
  });

  useEffect(() => {
    onTyping();
  }, [keys]);

  return null;
};
