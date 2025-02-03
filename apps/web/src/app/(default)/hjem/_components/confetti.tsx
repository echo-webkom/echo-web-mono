"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

import { useWindowSize } from "@/hooks/use-window-size";

type ConfettiForBDayProps = {
  duration?: number;
};

export default function ConfettiForBDay({ duration = 5000 }: ConfettiForBDayProps) {
  const { height, width } = useWindowSize();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [duration]);

  if (!isVisible) {
    return null;
  }

  return <Confetti height={height} width={width} />;
}
