import {useTransform, type MotionValue} from "framer-motion";

// functions
export const useParallax = (value: MotionValue<number>, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

// variants
export const staggeredListContainer = {
  hidden: {opacity: 0},
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1,
    },
  },
};

export const horizontalStaggeredChildren = {
  hidden: {x: "-100%"},
  show: {x: "0%"},
};

export const verticalStaggeredChildren = {
  hidden: {y: "100%"},
  show: {y: "0%"},
};
