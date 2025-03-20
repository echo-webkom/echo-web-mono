"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";
import { headerRoutes } from "./routes";

export const StaticPageSidebar = () => {
  const pathname = usePathname();

  const route = headerRoutes.find((route) => "path" in route && pathname.startsWith(route.path));
  const links = route && "links" in route ? route.links : [];

  if (!route || !links) {
    return null;
  }

  return (
    <aside className="hidden w-full max-w-[200px] flex-shrink-0 flex-col md:flex">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => {
          const isActive = link.href === pathname;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("text-muted-foreground hover:text-foreground", {
                "font-bold text-foreground": isActive,
              })}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
