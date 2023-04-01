import {motion} from "framer-motion";

const CheckIcon = () => {
  return (
    <svg className="h-6 w-6" stroke="black" viewBox="0 0 24 24" fill="none" strokeWidth={2}>
      <motion.path
        initial={{pathLength: 0}}
        animate={{pathLength: 1}}
        transition={{duration: 0.25, delay: 0.2, type: "tween", ease: "easeOut"}}
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
