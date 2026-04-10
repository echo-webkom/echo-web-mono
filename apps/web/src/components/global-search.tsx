"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";

function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (el as HTMLElement).isContentEditable
  );
}

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          "fixed top-[20%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border bg-background shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-150",
        )}
      >
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <SearchIcon className="text-muted-foreground size-4 shrink-0" />
          <input
            ref={inputRef}
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
            placeholder="Søk etter sider og arrangementer..."
          />
          <kbd className="text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-xs">
            ESC
          </kbd>
        </div>
        <div className="p-2">
          <p className="text-muted-foreground px-3 py-6 text-center text-sm">
            Ingen resultater
          </p>
        </div>
      </div>
    </>
  );
};
