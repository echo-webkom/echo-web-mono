"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EventCards } from "./cards/events";
import { useState } from "react";

// ---------------------------

const cards = [...EventCards];

// ---------------------------

export default function Wrapped() {
  const [cardIdx, setCardIdx] = useState(0);

  return (
    <>
      <div
        className="absolute overflow-hidden left-0 top-0 h-full w-full bg-wrapped-purple"
        id="wrapped-container"
      >
        <div className="w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              onClick={() => setCardIdx((prev) => (prev + 1) % cards.length)}
              id={`wrapped-card-${cardIdx}`}
              key={cardIdx}
              className="select-none"
            >
              {cards[cardIdx]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
