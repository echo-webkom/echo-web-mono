import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  openContainer,
  openItem,
  closedContainer,
  closedItem1,
  closedItem2,
} from "../animations/animation";

interface Props {
  open: boolean;
}

const MenuIcon = ({ open }: Props) => {
  return (
    <AnimatePresence>
      <div className="flex flex-col items-end gap-1 overflow-hidden hover:cursor-pointer">
        {!open ? (
          <>
            <motion.div
              key={`${open}`}
              variants={openContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col items-end"
            >
              <motion.div variants={openItem} className="mb-1">
                <div className="h-1 w-5 rounded-full bg-gray-800" />
              </motion.div>
              <motion.div variants={openItem} className="mb-1">
                <div className="h-1 w-4 rounded-full bg-gray-800" />
              </motion.div>
              <motion.div variants={openItem} className="mb-1">
                <div className="h-1 w-3 rounded-full bg-gray-800" />
              </motion.div>
            </motion.div>
          </>
        ) : (
          <>
            {/* <motion.div
            initial={{
              rotateZ: "0deg",
              transformOrigin: "center",
              translateY: "0%",
            }}
            animate={{ rotateZ: "135deg", translateY: "100%" }}
            transition={{ duration: 0.75 }}
            className="my-1 h-1 w-5 rounded-full bg-gray-800"
          />
          <motion.div
            initial={{ rotateZ: "0deg", transformOrigin: "center" }}
            animate={{ rotateZ: "-135deg" }}
            transition={{ duration: 0.75 }}
            className="my-1 h-1 w-5 rounded-full bg-gray-800"
          /> */}
            <motion.div
              key={`${open}`}
              variants={closedContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col items-end"
            >
              <motion.div variants={closedItem1} className="mb-1">
                <div className="h-1 w-5 rounded-full bg-gray-800" />
              </motion.div>
              <motion.div variants={closedItem2} className="mb-1">
                <div className="h-1 w-5 rounded-full bg-gray-800" />
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </AnimatePresence>
  );
};

export default MenuIcon;
