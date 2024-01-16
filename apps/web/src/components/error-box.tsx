"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RxCaretUp as CaretUp } from "react-icons/rx";

import { cn } from "@/utils/cn";

// TODO: Remove this component if
// https://github.com/echo-webkom/new-echo-web-monorepo/pull/672
// is merged
export function ErrorBox({ error }: { error: Error }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex flex-col rounded border border-yellow-400 bg-yellow-400/30 p-5">
      <button onClick={toggleOpen} className="flex items-center justify-between">
        <h2 className="text-xl font-bold">For utviklere</h2>

        <CaretUp
          className={cn("h-7 w-7 transform transition-transform duration-300", {
            "rotate-180": isOpen,
            "rotate-0": !isOpen,
          })}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto" },
              collapsed: { height: 0 },
            }}
            className="overflow-hidden"
          >
            <pre className="mt-5 overflow-x-scroll rounded-md bg-gray-100/50 p-5">
              <code>{error.message}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
