"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useSound } from "@/hooks/use-sound";
import { EndScreen } from "./cards/end";
import {
  AgendaEvent,
  AmountEvent,
  AmountEventPerGroup,
  BeerAmount,
  BestEvent,
  EventIntro,
  RegistrationsCard,
  Top10Events,
  YourBedpresses,
} from "./cards/events";
import {
  CommentSectionCard,
  HowManyMembers,
  InteractionCard,
  NumberOfUsers,
  YourInteractions,
} from "./cards/socials";
import { SplashScreen } from "./cards/splash";

const cards = [
  { component: <SplashScreen />, key: "wrapped-splash" },
  { component: <EventIntro />, key: "event-intro" },
  { component: <AmountEvent />, key: "amount-event" },
  { component: <AmountEventPerGroup />, key: "amount-event-per-group" },
  { component: <AgendaEvent />, key: "agenda-event" },
  { component: <RegistrationsCard />, key: "registrations" },
  { component: <BestEvent />, key: "best-event" },
  { component: <Top10Events />, key: "top-10-events" },
  { component: <BeerAmount />, key: "beer-amount" },
  { component: <YourBedpresses />, key: "your-bedpresses" },
  { component: <CommentSectionCard />, key: "comment-section" },
  { component: <InteractionCard />, key: "interaction" },
  { component: <YourInteractions />, key: "your-interactions" },
  { component: <HowManyMembers />, key: "how-many-members" },
  { component: <NumberOfUsers />, key: "user-count" },
  { component: <EndScreen />, key: "end-screen" },
];

const SUBWAY_SURFERS_THEME = "/sounds/subway-surfers-theme.mp3";

export default function Wrapped() {
  const [cardIdx, setCardIdx] = useState(0);
  const currentCard = cards[cardIdx];

  const { stop } = useSound(SUBWAY_SURFERS_THEME, { loop: true });

  useEffect(() => {
    if (cardIdx === cards.length - 1) {
      stop();
    }
  }, [cardIdx, stop]);

  if (!currentCard) {
    return <p>Internal error</p>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        id={`wrapped-card-${currentCard.key}`}
        onClick={() => setCardIdx((prev) => (prev < cards.length - 1 ? prev + 1 : prev))}
        key={currentCard.key}
        // className="relative select-none w-[30vw] h-[75vh]"
        className="overflow-hidden"
      >
        {currentCard.component}
      </motion.div>
    </AnimatePresence>
  );
}
