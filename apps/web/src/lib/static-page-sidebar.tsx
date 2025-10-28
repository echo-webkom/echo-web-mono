"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type HeaderQueryResult } from "@echo-webkom/cms/types";

import { cn } from "@/utils/cn";

type StaticPageSidebarProps = {
  header: HeaderQueryResult;
};

export const StaticPageSidebar = ({ header }: StaticPageSidebarProps) => {
  const pathname = usePathname();

  const route = header?.find((route) =>
    route.links?.some((link) => pathname.startsWith(link.linkTo)),
  );
  const links = route && "links" in route ? route.links : [];

  if (!route || !links) {
    return null;
  }

  return (
    <aside className="hidden w-full max-w-[200px] shrink-0 flex-col md:flex">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => {
          const isActive = link.linkTo === pathname;

          return (
            <Link
              key={link._key}
              href={link.linkTo ?? "#"}
              className={cn("text-muted-foreground hover:text-foreground", {
                "text-foreground font-bold": isActive,
              })}
            >
              {link.text}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
