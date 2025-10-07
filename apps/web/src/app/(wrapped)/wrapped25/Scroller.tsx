"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollerProps {
  slides: React.ReactNode[];
  desktopWidth?: number;
}

const Scroller: React.FC<ScrollerProps> = ({ slides, desktopWidth = 520 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);

  const handleScroll = () => {
    if (isScrolling.current) return;
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / viewportHeight);

    if (newIndex !== currentIndex) {
      isScrolling.current = true;
      setCurrentIndex(newIndex);

      container.scrollTo({
        top: newIndex * viewportHeight,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 600);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: currentIndex * container.clientHeight,
      behavior: "smooth",
    });
  }, [currentIndex]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div
        ref={containerRef}
        className="scrollbar-hide relative h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
        style={{
          width: `${desktopWidth}px`,
          maxWidth: "100vw",
        }}
      >
        {slides.map((Slide, index) => (
          <div key={index} className="flex h-screen w-full snap-start items-center justify-center">
            {Slide}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scroller;
