"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface ComponentEntry {
  displayName: string;
  slug: string;
  propsCount: number;
}

export function BrandingSidebar({ components }: { components: ComponentEntry[] }) {
  const pathname = usePathname();
  const [filter, setFilter] = useState("");

  const filteredComponents = components.filter((c) =>
    c.displayName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/40 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* Search Input */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter components..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Overview
          </p>
          <Link
            href="/branding"
            className={`block rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/branding"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            Introduction
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Components
            </p>
            <span className="text-[10px] text-muted-foreground font-mono">
              {filteredComponents.length}
            </span>
          </div>
          <nav className="space-y-0.5">
            {filteredComponents.map((c) => {
              const href = `/branding/${c.slug}`;
              const isActive = pathname === href;

              return (
                <Link
                  key={c.slug}
                  href={href}
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{c.displayName}</span>
                  <span className="text-[10px] text-muted-foreground/70 font-mono">
                    {c.propsCount}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}