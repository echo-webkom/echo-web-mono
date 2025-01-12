"use client";

import { useEffect, useRef } from "react";

type UseSoundOptions = {
  delay: number; // Delay in milliseconds
  volume: number; // Volume from 0 to 1
  loop: boolean; // Loop audio?
};

const defaultOptions: UseSoundOptions = {
  delay: 0,
  volume: 0.5,
  loop: false,
};

export const useSound = (file: string, options: Partial<UseSoundOptions> = {}) => {
  const {
    delay = defaultOptions.delay,
    volume = defaultOptions.volume,
    loop = defaultOptions.loop,
  } = options;

  const audio = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    if (audio.current) {
      audio.current.volume = 0;
    }
    audio.current?.pause();
    audio.current = null;
  };

  useEffect(() => {
    const playAudio = async () => {
      try {
        audio.current = new Audio(file);
        audio.current.volume = volume;
        audio.current.loop = loop;

        if (delay && delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        await audio.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    void playAudio();

    return () => {
      if (audio.current) {
        audio.current.volume = 0;
      }
      audio.current?.pause();
      audio.current = null;
    };
  }, [delay, file, loop, volume]);

  return {
    stop,
  };
};
