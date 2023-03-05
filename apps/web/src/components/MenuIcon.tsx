import {AnimatePresence, motion} from "framer-motion";

const openContainer = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.2,
    },
  },
  exit: {
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const openItem = {
  hidden: {
    x: "100%",
  },
  show: {
    x: "0%",
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    x: "100%",
  },
};

const closedContainer = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};

const closedItem1 = {
  hidden: {
    x: "100%",
    y: "-100%",
  },
  show: {
    x: "0%",
    y: "100%",
    transfrom: {
      rotateZ: "45deg",
    },
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    x: "100%",
  },
};

const closedItem2 = {
  hidden: {
    x: "100%",
    y: "0%",
  },
  show: {
    x: "0%",
    y: "-100%",
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    x: "100%",
  },
};

interface Props {
  open: boolean;
}

export const MenuIcon = ({open}: Props) => {
  return (
    <AnimatePresence>
      <div className="flex flex-col items-end gap-1 overflow-hidden hover:cursor-pointer">
        {!open ? (
          <motion.div
            variants={openContainer}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col items-end"
          >
            <motion.div variants={openItem} className="mb-1">
              <div className="h-[2px] w-5 rounded-full bg-gray-800" />
            </motion.div>
            <motion.div variants={openItem} className="mb-1">
              <div className="h-[2px] w-4 rounded-full bg-gray-800" />
            </motion.div>
            <motion.div variants={openItem} className="mb-1">
              <div className="h-[2px] w-3 rounded-full bg-gray-800" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            variants={closedContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-end"
          >
            <motion.div variants={closedItem1} className="mb-1">
              <div className="h-[2px] w-5 rounded-full bg-gray-800" />
            </motion.div>
            <motion.div variants={closedItem2} className="mb-1">
              <div className="h-[2px] w-5 rounded-full bg-gray-800" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
