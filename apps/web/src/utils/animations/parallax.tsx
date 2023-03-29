import {useRef, type ReactNode} from "react";
import {motion, useScroll} from "framer-motion";

import {useParallax} from "./helpers";

type ParallaxProps = {
  slowElement: ReactNode;
  fastElement: ReactNode;
  speed?: number;
};

export const Parallax = ({slowElement, fastElement, speed}: ParallaxProps) => {
  const target = useRef(null);
  const {scrollYProgress} = useScroll({target});
  const y = useParallax(scrollYProgress, speed ? speed : 300);

  return (
    <>
      <div ref={target}>{slowElement}</div>
      <motion.div style={{y}}>{fastElement}</motion.div>
    </>
  );
};
