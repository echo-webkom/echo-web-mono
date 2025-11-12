"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollerProps {
  slides: Array<React.ReactNode>;
  desktopWidth?: number;
}

const Scroller: React.FC<ScrollerProps> = ({ slides, desktopWidth = 520 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // 🌊 Smooth scroll-funksjon med easing
  const scrollToSlide = (index: number) => {
    const container = containerRef.current;
    if (!container || isAnimating.current) return;

    const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
    const target = targetIndex * container.clientHeight;
    const start = container.scrollTop;
    const distance = target - start;
    const duration = 700;
    let startTime: number | null = null;

    isAnimating.current = true;

    function animateScroll(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing: easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      container.scrollTop = start + distance * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isAnimating.current = false;
        setCurrentIndex(targetIndex);
      }
    }

    requestAnimationFrame(animateScroll);
  };

  // 📦 Scroll listener — oppdager bevegelse og snapper etterpå
  const handleScroll = () => {
    if (isAnimating.current) return;
    const container = containerRef.current;
    if (!container) return;

    // Tøm forrige timeout
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    // Når scroll stopper (ingen endring i 100ms)
    scrollTimeout.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / viewportHeight);

      scrollToSlide(newIndex);
    }, 100);
  };

  // 🎹 Pil opp/ned for navigasjon
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") scrollToSlide(currentIndex + 1);
      if (e.key === "ArrowUp") scrollToSlide(currentIndex - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  // 📜 Koble scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div
        ref={containerRef}
        className="scrollbar-hide relative h-full overflow-y-scroll"
        style={{
          width: `${desktopWidth}px`,
          maxWidth: "100vw",
          scrollSnapType: "y mandatory",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {slides.map((Slide, index) => (
          <div key={index} className="flex h-screen w-full snap-start items-center justify-center">
            {React.cloneElement(Slide as React.ReactElement, {
              goToNext: () => scrollToSlide(index + 1),
              goToSlide: scrollToSlide,
              isActive: currentIndex === index,
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scroller;
