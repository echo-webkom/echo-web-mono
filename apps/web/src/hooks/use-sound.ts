import { useCallback, useEffect } from "react";

type UseSoundOptions = {
  // Delay in milliseconds
  delay?: number;
};

export const useSound = (
  file: string,
  options: UseSoundOptions = {
    delay: 0,
  },
) => {
  const createAudio = useCallback(() => {
    const audio = new Audio(file);
    audio.volume = 0.5;
    return audio;
  }, [file]);

  useEffect(() => {
    const audio = createAudio();

    const play = async () => {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, options.delay);
        });

        await audio.play();
      } catch (err) {
        console.error(err);
      }
    };

    void play();

    return () => {
      audio.pause();
    };
  }, [createAudio, options]);
};
