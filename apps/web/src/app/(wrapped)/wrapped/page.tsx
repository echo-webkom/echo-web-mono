"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EventCards } from "./cards/events";
import { useState } from "react";
import { SocialCards } from "./cards/socials";

// ---------------------------

const cards = [...SocialCards, ...EventCards];

// ---------------------------

export default function Wrapped() {
  const [cardIdx, setCardIdx] = useState(0);

  return (
    <>
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
    </>
  );
}
