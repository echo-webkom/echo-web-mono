"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { useOutsideClick } from "@/hooks/use-outsideclick";
import { headerRoutes } from "@/lib/routes";
import { cn } from "@/utils/cn";

type NavigationContextType = {
  activeDropdown: React.ReactNode | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
};

const NavigationRoot = ({ children }: { children: React.ReactNode }) => {
  const [activeDropdown, setActiveDropdown] = useState<React.ReactNode | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useOutsideClick(() => {
    setActiveDropdown(null);
  }, [navRef]);

  return (
    <NavigationContext.Provider value={{ activeDropdown, setActiveDropdown }}>
      <nav ref={navRef} className="mt-auto hidden px-6 py-2 md:block">
        {children}
      </nav>
    </NavigationContext.Provider>
  );
};

const NavigationList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="flex items-center">{children}</ul>;
};

const NavigationItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const { activeDropdown, setActiveDropdown } = useNavigation();

  const isActive = activeDropdown === children;

  const handleClick = () => {
    setActiveDropdown(isActive ? null : children);
  };

  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname, setActiveDropdown]);

  return (
    <li className="relative">
      <button
        className="flex flex-row items-center gap-1 rounded-md p-2 text-gray-600 hover:bg-muted dark:text-foreground"
        onClick={handleClick}
      >
        <span>{label}</span>
        <span>
          <ChevronDownIcon
            className={cn("h-4 w-4 transition duration-200 ease-in-out", {
              "rotate-180 transform": isActive,
            })}
          />
        </span>
      </button>
    </li>
  );
};

const NavigationLink = ({ children, to }: { children: React.ReactNode; to: string }) => {
  return (
    <li>
      <Link
        href={to}
        className="rounded-md p-2 text-gray-600 hover:bg-muted hover:underline dark:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
};

const NavigationDropdown = ({ children }: { children: React.ReactNode }) => {
  return <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-2">{children}</ul>;
};

const NavigationViewport = () => {
  const { activeDropdown } = useNavigation();

  if (!activeDropdown) {
    return null;
  }

  return (
    <div className="absolute left-0 z-20 w-full border-b bg-background p-4 shadow-lg">
      {activeDropdown}
    </div>
  );
};

export function DesktopNavigation() {
  return (
    <NavigationRoot>
      <NavigationList>
        <NavigationLink to="/">Hjem</NavigationLink>
        {headerRoutes.map((route) => (
          <NavigationItem key={route.label} label={route.label}>
            <NavigationDropdown>
              {route.sublinks.map((subroute) => (
                <Link key={subroute.label} className="p-2 hover:bg-muted" href={subroute.href}>
                  {subroute.label}
                </Link>
              ))}
            </NavigationDropdown>
          </NavigationItem>
        ))}
      </NavigationList>

      <NavigationViewport />
    </NavigationRoot>
  );
}
