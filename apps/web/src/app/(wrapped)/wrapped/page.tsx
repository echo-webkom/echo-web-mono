"use client";

import React, { useEffect, useRef } from "react";
import AnimatedBg from "./components/AnimatedBg";
import { motion, useAnimation } from "framer-motion";

// ---------------------------

const Card1 = () => <div className="p-10 bg-red-800">Card1</div>;
const Card2 = () => <div className="p-10 bg-blue-800">Card2</div>;
const Card3 = () => <div className="p-10 bg-green-800">Card3</div>;

const cards = [<Card1 />, <Card2 />, <Card3 />];

// ---------------------------

export default function Wrapped() {
  const controls = useAnimation();
  const animationRef = useRef(null);

  useEffect(() => {
    let current = 0;

    const setCurrentCardVisible = () => {
      for (let i = 0; i < cards.length; i++) {
        const c = document.getElementById(`wrapped-card-${i}`);
        if (c === null) return;
        c.style.display = i === current % cards.length ? "block" : "none";
      }
    };

    document
      .getElementById("wrapped-container")
      ?.addEventListener("click", async (e) => {
        e.preventDefault();
        await gotoNextCard();
      });

    async function gotoNextCard() {
      await controls.start({
        scale: 0,
        rotate: 0,
        transition: {
          duration: 0.3,
        },
      });

      setCurrentCardVisible();
      current++;

      await controls.start({
        scale: 1,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.3,
        },
      });

      await controls.start({
        scale: 1,
        rotate: 0,
        transition: {
          duration: 0,
        },
      });
    }

    // void because void
    void gotoNextCard();
  });

  return (
    <>
      <AnimatedBg>
        <div
          className="h-full flex items-center justify-center"
          id="wrapped-container"
        >
          {cards.map((item, index) => (
            <motion.div
              ref={animationRef}
              id={`wrapped-card-${index}`}
              key={index}
              className="select-none"
              animate={controls}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </AnimatedBg>
    </>
  );
}
