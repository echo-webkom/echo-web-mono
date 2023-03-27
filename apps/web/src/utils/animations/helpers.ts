import {useTransform, type MotionValue} from "framer-motion";

export const useParallax = (value: MotionValue<number>, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};
