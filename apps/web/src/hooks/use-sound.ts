import { useCallback, useEffect } from "react";

export const useSound = (file: string) => {
  const createAudio = useCallback(() => {
    const audio = new Audio(file);
    audio.volume = 0.5;
    return audio;
  }, [file]);

  useEffect(() => {
    const audio = createAudio();

    const play = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.error(err);
      }
    };

    void play();

    return () => {
      audio.pause();
    };
  }, [createAudio]);
};
