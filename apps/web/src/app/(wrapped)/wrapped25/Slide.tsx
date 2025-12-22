import { useEffect, useRef, useState } from "react";

export function Slide({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true);
      },
      {
        threshold: 0.9, // triggers when 90% of the slide is visible
      },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center">
      {isVisible && <>{children}</>}
    </div>
  );
}
