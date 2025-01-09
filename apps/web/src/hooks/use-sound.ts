"use client";

import { useEffect } from "react";

type UseSoundOptions = {
  delay: number; // Delay in milliseconds
  volume: number; // Volume from 0 to 1
};

const defaultOptions: UseSoundOptions = {
  delay: 0,
  volume: 0.5,
};

export const useSound = (file: string, options: Partial<UseSoundOptions> = {}) => {
  const { delay = defaultOptions.delay, volume = defaultOptions.volume } = options;

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    const playAudio = async () => {
      try {
        audio = new Audio(file);
        audio.volume = volume;

        if (delay && delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        await audio.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    void playAudio();

    return () => {
      if (audio) {
        audio.pause();
        audio.volume = 0;
        audio = null;
      }
    };
  }, [file, delay, volume]);
};
