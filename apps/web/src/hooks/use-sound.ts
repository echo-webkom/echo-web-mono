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

// Array to keep track of all active audio instances
const audioInstances: HTMLAudioElement[] = [];

export const useSound = (file: string, options: Partial<UseSoundOptions> = {}) => {
  const { delay = defaultOptions.delay, volume = defaultOptions.volume } = options;

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    const playAudio = async () => {
      try {
        audio = new Audio(file);
        audio.volume = volume;

        // Add the audio instance to the global array
        audioInstances.push(audio);

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
        // Remove the audio instance from the global array
        const index = audioInstances.indexOf(audio);
        if (index !== -1) {
          audioInstances.splice(index, 1);
        }

        audio.pause();
        audio.volume = 0;
        audio = null;
      }
    };
  }, [file, delay, volume]);
};

export const stopAllSounds = () => {
  audioInstances.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0; // Reset the playback position
  });

  // Clear the audioInstances array
  audioInstances.length = 0;
};
