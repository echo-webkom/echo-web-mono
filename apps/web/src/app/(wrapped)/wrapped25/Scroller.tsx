"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface ScrolledSlideProps {
  index?: number;
  isActive?: boolean;
  scrollToSlide?: (index: number, instant?: boolean) => void;
  goToNext?: () => void;
}

const Scroller: React.FC<ScrollerProps> = ({ slides = [], desktopWidth = 520, onSlideChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentIndex);
    }
  }, [currentIndex, onSlideChange]);

  const scrollToSlide = useCallback(
    (index: number, instant = false) => {
      const container = containerRef.current;
      if (!container) return;

      const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
      const target = targetIndex * container.clientHeight;

      if (instant) {
        container.scrollTop = target;
        setCurrentIndex(targetIndex);
        return;
      }

      container.scrollTo({
        top: target,
        behavior: "smooth",
      });

      setCurrentIndex(targetIndex);
    },
    [slides.length],
  );

  const isThrottled = useRef(false);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || isThrottled.current) return;

    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;

    const newIndex = Math.round(scrollTop / viewportHeight);

    if (newIndex !== currentIndex) {
      isThrottled.current = true;
      setCurrentIndex(newIndex);

      if (onSlideChange) onSlideChange(newIndex);

      setTimeout(() => {
        isThrottled.current = false;
      }, 600);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") scrollToSlide(currentIndex + 1);
      if (e.key === "ArrowUp") scrollToSlide(currentIndex - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

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
        }}
      >
        {slides.map((slide, index) => {
          if (!React.isValidElement(slide)) return null;

          return (
            <div
              key={index}
              className="flex h-screen w-full snap-start items-center justify-center"
            >
              {React.cloneElement(slide as React.ReactElement<ScrolledSlideProps>, {
                index,
                scrollToSlide,
                isActive: currentIndex === index,
                goToNext: () => scrollToSlide(index + 1),
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scroller;
