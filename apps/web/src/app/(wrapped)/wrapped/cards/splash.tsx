import { Radley, Ranchers } from "next/font/google";
import { motion } from "motion/react";

const radley = Radley({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

export const SplashScreen = () => {
  return (
    <>
      <div className="absolute flex h-full w-full cursor-pointer items-center justify-center">
        <div
          className={
            "bg-wrapped-pink text-wrapped-yellow flex h-full w-1/2 flex-col items-end overflow-hidden " +
            radley.className
          }
        >
          <motion.div
            initial={{
              x: 200,
              y: 0,
            }}
            animate={{
              x: 200,
              y: -3000,
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            {Array.from({ length: 200 }).map((_, index) => {
              return (
                <>
                  <p key={index} className="text-8xl opacity-70">
                    ECHO WRAPPED
                  </p>
                  <p key={index} className="text-8xl opacity-70">
                    WRAPPED ECHO
                  </p>
                </>
              );
            })}
          </motion.div>
        </div>
        <div className="bg-wrapped-purple flex h-full w-1/2 flex-col justify-center gap-5 p-14">
          <p className={"text-wrapped-black text-5xl font-bold " + ranchers.className}>
            echo wrapped 2024 er her!
          </p>
          <p className="text-wrapped-grey text-2xl opacity-50">Klikk for å starte</p>
        </div>
      </div>
    </>
  );
};
