import { motion } from "motion/react";

export const Confetti = ({ delay }: { delay: number }) => {
  return (
    <div className="absolute h-full w-full overflow-hidden">
      {[...new Array(100).keys()].map((index, _) => {
        // eslint-disable-next-line react-hooks/purity
        const x = Math.floor(Math.random() * 99);
        // eslint-disable-next-line react-hooks/purity
        const particleDelay = Math.random() * 5 + delay;
        // eslint-disable-next-line react-hooks/purity
        const offx1 = Math.floor(Math.random() * 3);
        // eslint-disable-next-line react-hooks/purity
        const offx2 = Math.floor(Math.random() * 3);

        const colors = [
          "bg-wrapped-yellow",
          "bg-wrapped-purple",
          "bg-wrapped-pink",
          "bg-wrapped-orange",
          "bg-wrapped-white",
          "bg-wrapped-blue",
          "bg-wrapped-green",
        ];

        // eslint-disable-next-line react-hooks/purity
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <motion.div
            key={index}
            className={"absolute h-2 w-2 rounded-full " + color}
            style={{
              translateX: `${x}vw`,
            }}
            initial={{ x: 0, y: -10, opacity: 1 }}
            animate={{ y: 1000, x: [0, -offx1, offx2], opacity: 0 }}
            transition={{
              duration: 5,
              x: { duration: 0.2, repeat: Infinity },
              delay: particleDelay,
              repeat: Infinity,
            }}
          />
        );
      })}
    </div>
  );
};
