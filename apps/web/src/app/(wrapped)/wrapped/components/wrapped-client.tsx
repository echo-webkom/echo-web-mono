"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useSound } from "@/hooks/use-sound";
import { EndScreen } from "../cards/end";
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
} from "../cards/events";
import {
  CommentSectionCard,
  HowManyMembers,
  InteractionCard,
  NumberOfUsers,
  YourInteractions,
} from "../cards/socials";
import { SplashScreen } from "../cards/splash";

const CARDS = [
  { requireAuth: false, component: <SplashScreen />, key: "wrapped-splash" },
  { requireAuth: false, component: <EventIntro />, key: "event-intro" },
  { requireAuth: false, component: <AmountEvent />, key: "amount-event" },
  { requireAuth: false, component: <AmountEventPerGroup />, key: "amount-event-per-group" },
  { requireAuth: false, component: <AgendaEvent />, key: "agenda-event" },
  { requireAuth: false, component: <RegistrationsCard />, key: "registrations" },
  { requireAuth: false, component: <BestEvent />, key: "best-event" },
  { requireAuth: false, component: <Top10Events />, key: "top-10-events" },
  { requireAuth: false, component: <BeerAmount />, key: "beer-amount" },
  { requireAuth: true, component: <YourBedpresses />, key: "your-bedpresses" },
  { requireAuth: false, component: <CommentSectionCard />, key: "comment-section" },
  { requireAuth: false, component: <InteractionCard />, key: "interaction" },
  { requireAuth: true, component: <YourInteractions />, key: "your-interactions" },
  { requireAuth: false, component: <HowManyMembers />, key: "how-many-members" },
  { requireAuth: false, component: <NumberOfUsers />, key: "user-count" },
  { requireAuth: false, component: <EndScreen />, key: "end-screen" },
];

const SUBWAY_SURFERS_THEME = "/sounds/subway-surfers-theme.mp3";

type WrappedClientProps = {
  isSignedIn: boolean;
};

export const WrappedClient = ({ isSignedIn }: WrappedClientProps) => {
  const cards = CARDS.filter((card) => !card.requireAuth || isSignedIn);

  const [cardIdx, setCardIdx] = useState(0);
  const { stop } = useSound(SUBWAY_SURFERS_THEME, { loop: true, volume: 0.2 });

  useEffect(() => {
    if (cardIdx === cards.length - 1) {
      stop();
    }
  }, [cardIdx, cards.length, stop]);

  const currentCard = cards[cardIdx];

  if (!currentCard) {
    return <p>Internal error</p>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        id={`wrapped-card-${currentCard.key}`}
        onClick={() => setCardIdx((prev) => (prev < cards.length - 1 ? prev + 1 : prev))}
        key={currentCard.key}
        className="overflow-hidden"
      >
        {currentCard.component}
      </motion.div>
    </AnimatePresence>
  );
};
