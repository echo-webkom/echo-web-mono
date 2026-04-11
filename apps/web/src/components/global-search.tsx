"use client";

import { happeningTypeToPath } from "@echo-webkom/lib";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import type { CMSHappening } from "@/api/uno/client";
import { useUnoClient } from "@/providers/uno";
import { cn } from "@/utils/cn";

import { headerRoutes, type Route } from "../lib/routes";

type SearchItem = {
  title: string;
  href: string;
  category: string;
};

function fuzzyScore(query: string, target: string): number {
  if (query.length === 0) return 1;

  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (t.includes(q)) return 100 + (1 / t.length) * 10;

  let score = 0;
  let qi = 0;
  let lastMatch = -1;
  let consecutive = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 10;
      if (lastMatch === ti - 1) {
        consecutive++;
        score += consecutive * 5;
      } else {
        consecutive = 0;
      }
      lastMatch = ti;
      qi++;
    }
  }

  return qi === q.length ? score : 0;
}

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

function getStaticPages(routes: Array<Route>): Array<SearchItem> {
  return routes.flatMap((route) => {
    if ("href" in route) {
      return [{ title: route.label, href: route.href, category: "Side" }];
    }
    return route.links.map((link) => ({
      title: link.label,
      href: link.href,
      category: route.label,
    }));
  });
}

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasFetched = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const unoClient = useUnoClient();

  const staticPages = getStaticPages(headerRoutes);
  const [allItems, setAllItems] = useState<Array<SearchItem>>(staticPages);

  const fetchHappenings = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    try {
      const happenings = await unoClient.sanity.happenings.all();
      const items = happenings
        .sort((a, b) => (new Date(a._createdAt) > new Date(b._createdAt) ? 1 : -1))
        .map(
          (h: CMSHappening): SearchItem => ({
            title: h.title,
            href: `${happeningTypeToPath[h.happeningType]}/${h.slug}`,
            category: h.happeningType === "bedpres" ? "Bedriftspresentasjon" : "Arrangement",
          }),
        );
      setAllItems([...staticPages, ...items]);
    } catch {
      // keep static pages only
    }
  }, [unoClient]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault();
        setIsOpen(true);
        void fetchHappenings();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fetchHappenings]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const results = query.trim()
    ? allItems
        .map((item) => ({ item, score: fuzzyScore(query, item.title) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(({ item }) => item)
    : staticPages.slice(0, 10);

  const clampedIndex = Math.min(selectedIndex, results.length - 1);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        router.push(results[clampedIndex]?.href ?? "");
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, results, clampedIndex, router]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="bg-background/80 fixed inset-0 z-50 backdrop-blur-xs"
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
            placeholder="Søk etter sider og arrangementer..."
          />
          <kbd className="text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-xs">
            ESC
          </kbd>
        </div>

        <div className="max-h-[min(60vh,400px)] overflow-y-auto p-1">
          {results.length === 0 ? (
            <p className="text-muted-foreground px-3 py-6 text-center text-sm">Ingen resultater</p>
          ) : (
            results.map((item, i) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                  i === clampedIndex
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <span className="font-medium">{item.title}</span>
                <span
                  className={cn(
                    "text-xs",
                    i === clampedIndex ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};
