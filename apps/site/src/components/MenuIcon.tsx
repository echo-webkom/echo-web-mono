import React from "react";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
}

const MenuIcon = ({ open }: Props) => {
  return (
    <div className="flex flex-col items-end gap-1 overflow-hidden hover:cursor-pointer">
      {!open ? (
        <>
          <motion.div
            initial={{ translateX: "100%" }}
            animate={{ translateX: "0%" }}
            transition={{ delay: 0, duration: 0.1 }}
            exit={{ translateX: "100%" }}
            className="h-1 w-5 rounded-full bg-gray-800"
          />
          <motion.div
            initial={{ translateX: "100%" }}
            animate={{ translateX: "0%" }}
            transition={{ delay: 0.25, duration: 0.1 }}
            exit={{ translateX: "100%" }}
            className="h-1 w-4 rounded-full bg-gray-800"
          />
          <motion.div
            initial={{ translateX: "100%" }}
            animate={{ translateX: "0%" }}
            transition={{ delay: 0.5, duration: 0.1 }}
            exit={{ translateX: "100%" }}
            className="h-1 w-3 rounded-full bg-gray-800"
          />
        </>
      ) : (
        <div className="">
          <motion.div className="my-1 h-1 w-5 rotate-45 rounded-full bg-gray-800" />
          <motion.div className="my-1 h-1 w-5 -rotate-45 rounded-full bg-gray-800" />
        </div>
      )}
    </div>
  );
};

export default MenuIcon;
