"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  AgendaEvent,
  AmountEvent,
  AmountEventPerGroup,
  BestEvent,
  EventIntro,
  RegistrationsCard,
} from "./cards/events";
import { CommentSectionCard, InteractionCard, YourInteractions } from "./cards/socials";

const cards = [
  { component: <YourInteractions />, key: "your-interactions" },
  { component: <EventIntro />, key: "event-intro" },
  { component: <AmountEvent />, key: "amount-event" },
  { component: <AmountEventPerGroup />, key: "amount-event-per-group" },
  { component: <AgendaEvent />, key: "agenda-event" },
  { component: <RegistrationsCard />, key: "registrations" },
  { component: <BestEvent />, key: "best-event" },
  { component: <CommentSectionCard />, key: "comment-section" },
  { component: <InteractionCard />, key: "interaction" },
];

export default function Wrapped() {
  const [cardIdx, setCardIdx] = useState(0);

  const currentCard = cards[cardIdx];

  if (!currentCard) {
    return <p>Internal error</p>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        id={`wrapped-card-${currentCard.key}`}
        onClick={() => setCardIdx((prev) => (prev + 1) % cards.length)}
        key={currentCard.key}
        // className="relative select-none w-[30vw] h-[75vh]"
        className="overflow-hidden"
      >
        {currentCard.component}
      </motion.div>
    </AnimatePresence>
  );
}
