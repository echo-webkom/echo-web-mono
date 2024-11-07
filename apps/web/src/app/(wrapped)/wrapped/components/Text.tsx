import { motion } from "framer-motion";

export function AppearingText({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { ease: "easeOut", delay: delay },
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

export function InYourFace({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <>
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1.5, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          delay: delay,
          ease: "anticipate",
          duration: 1,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
