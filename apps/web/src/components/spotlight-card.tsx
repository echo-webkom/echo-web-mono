import {type MouseEvent} from "react";
import {motion, useMotionTemplate, useMotionValue} from "framer-motion";

type SpotlightCardProps = {
  hoverColor?: string;
  children: React.ReactNode;
};

const SpotlightCard = ({hoverColor = "#fed879", children}: SpotlightCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({currentTarget, clientX, clientY}: MouseEvent) {
    const {left, top} = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // TODO: Use variables for the colors
  return (
    <div className="group relative rounded-xl border shadow-2xl" onMouseMove={handleMouseMove}>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${hoverColor}20,
              transparent 80%
            )
          `,
        }}
      />
      <div>{children}</div>
    </div>
  );
};

export default SpotlightCard;
