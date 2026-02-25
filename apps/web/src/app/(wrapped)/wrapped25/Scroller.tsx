"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface ScrollerContextType {
  scrollToSlide: (index: number, instant?: boolean) => void;
  goToNext: () => void;
  currentIndex: number;
}

const ScrollerContext = createContext<ScrollerContextType | null>(null);

export const useScroller = () => {
  const context = useContext(ScrollerContext);
  if (!context) throw new Error("useScroller must be used within a Scroller");
  return context;
};

interface ScrollerProps {
  slides: Array<React.ReactNode>;
  desktopWidth?: number;
  desktopHeight?: number;
  onSlideChange?: (index: number) => void;
}

const Scroller: React.FC<ScrollerProps> = ({
  slides = [],
  desktopWidth = 430,
  desktopHeight = 844,
  onSlideChange,
}: ScrollerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProgrammaticScroll = useRef(false);

  const supportsScrollEnd = useRef(typeof window !== "undefined" && "onscrollend" in window);

  const updateIndex = useCallback(
    (newIndex: number) => {
      setCurrentIndex(newIndex);
      onSlideChange?.(newIndex);
    },
    [onSlideChange],
  );

  const scrollToSlide = useCallback(
    (index: number, instant = false) => {
      const container = containerRef.current;
      if (!container) return;

      const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
      const target = targetIndex * container.clientHeight;

      isProgrammaticScroll.current = true;
      container.style.scrollSnapType = "none";

      if (instant) {
        container.scrollTop = target;
        updateIndex(targetIndex);
        container.style.scrollSnapType = "y mandatory";
        isProgrammaticScroll.current = false;
        return;
      }

      gsap.to(container, {
        scrollTop: target,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          if (container) {
            container.style.scrollSnapType = "y mandatory";
            isProgrammaticScroll.current = false;
          }
        },
      });

      updateIndex(targetIndex);
    },
    [slides.length, updateIndex],
  );

  const syncIndexFromScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;

    const container = containerRef.current;
    if (!container) return;

    const newIndex = Math.round(container.scrollTop / container.clientHeight);
    if (newIndex >= 0 && newIndex < slides.length) {
      updateIndex(newIndex);
    }
  }, [slides.length, updateIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (supportsScrollEnd.current) {
      container.addEventListener("scrollend", syncIndexFromScroll, {
        passive: true,
      });
      return () => container.removeEventListener("scrollend", syncIndexFromScroll);
    }

    const handleScroll = () => {
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = setTimeout(syncIndexFromScroll, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, [syncIndexFromScroll]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToSlide(currentIndex + 1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToSlide(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, scrollToSlide]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]!.clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - e.changedTouches[0]!.clientY;
      touchStartY.current = null;

      if (Math.abs(delta) < 50) return;

      if (delta > 0) {
        scrollToSlide(currentIndex + 1);
      } else {
        scrollToSlide(currentIndex - 1);
      }
    },
    [currentIndex, scrollToSlide],
  );

  const contextValue: ScrollerContextType = {
    scrollToSlide,
    goToNext: () => scrollToSlide(currentIndex + 1),
    currentIndex,
  };

  return (
    <ScrollerContext.Provider value={contextValue}>
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div
          ref={containerRef}
          role="region"
          aria-label="echo Wrapped 2025 – slideshow"
          className="scrollbar-hide relative overflow-y-scroll"
          style={{
            width: `min(${desktopWidth}px, 100vw)`,
            height: `min(${desktopHeight}px, 100dvh)`,
            scrollSnapType: "y mandatory",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
              className="flex w-full flex-shrink-0 snap-start items-center justify-center"
              style={{ height: `min(${desktopHeight}px, 100dvh)` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
    </ScrollerContext.Provider>
  );
};

export default Scroller;
