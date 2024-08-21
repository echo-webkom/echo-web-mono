"use client";

import React, { createContext, useContext, useEffect, useRef, useState, type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { type IconBaseProps } from "react-icons";
import { RxChevronDown as ChevronDown } from "react-icons/rx";

import { useOutsideClick } from "@/hooks/use-outsideclick";
import { headerRoutes } from "@/lib/routes";
import { cn } from "@/utils/cn";

type NavigationContextType = {
  activeDropdown: { id: string; children: React.ReactNode } | null;
  setActiveDropdown: React.Dispatch<
    React.SetStateAction<{
      id: string;
      children: React.ReactNode;
    } | null>
  >;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
};

export const NavigationRoot = ({ children }: { children: React.ReactNode }) => {
  const [activeDropdown, setActiveDropdown] = useState<{
    id: string;
    children: React.ReactNode;
  } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useOutsideClick(() => {
    setActiveDropdown(null);
  }, [navRef]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (activeDropdown && event.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
  }, [activeDropdown]);

  return (
    <NavigationContext.Provider value={{ activeDropdown, setActiveDropdown }}>
      <div ref={navRef}>{children}</div>
    </NavigationContext.Provider>
  );
};

const NavigationList = ({ children }: { children: React.ReactNode }) => {
  return <ul className="hidden items-center px-6 pt-2 md:flex">{children}</ul>;
};

const NavigationItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const { activeDropdown, setActiveDropdown } = useNavigation();

  const isActive = activeDropdown?.id === label;

  const handleClick = () => {
    setActiveDropdown(
      isActive
        ? null
        : {
            id: label,
            children,
          },
    );
  };

  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname, setActiveDropdown]);

  return (
    <li className="relative">
      <button
        className="flex h-10 flex-row items-center gap-1 rounded-xl p-2 font-semibold text-gray-600 hover:bg-muted dark:text-foreground"
        onClick={handleClick}
      >
        <span>{label}</span>
        <span>
          <ChevronDown
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
        className="h-10 rounded-xl p-2 font-semibold text-gray-600 hover:bg-muted hover:underline dark:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
};

const NavigationDropdown = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="mx-auto hidden max-w-6xl grid-cols-2 gap-2 px-4 py-6 md:grid lg:grid-cols-3">
      {children}
    </ul>
  );
};

export const NavigationViewport = () => {
  const { activeDropdown } = useNavigation();

  const [contentHeight, setContentHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeDropdown?.children) {
      setContentHeight(0);
      return;
    }

    setContentHeight(ref.current?.clientHeight ?? 0);
  }, [activeDropdown]);

  return (
    <AnimatePresence>
      {activeDropdown && (
        <motion.div
          className="absolute left-0 z-20 w-full overflow-hidden border-b-2 bg-background"
          initial={{
            height: 0,
          }}
          animate={{
            height: contentHeight,
          }}
          exit={{
            height: 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <div ref={ref}>{activeDropdown.children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const DesktopNavigation = () => {
  return (
    <NavigationList>
      {headerRoutes.map((route) => {
        if ("href" in route) {
          return (
            <NavigationLink key={route.label} to={route.href}>
              {route.label}
            </NavigationLink>
          );
        }

        return (
          <NavigationItem key={route.label} label={route.label}>
            <NavigationDropdown>
              {route.links.map((link) => (
                <IconLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  description={link.description}
                  icon={link.icon}
                />
              ))}
            </NavigationDropdown>
          </NavigationItem>
        );
      })}
    </NavigationList>
  );
};

type IconLinkProps = {
  href: string;
  label: string;
  description: string;
  icon: FC<IconBaseProps>;
};

const IconLink = ({ icon, ...props }: IconLinkProps) => {
  return (
    <Link
      className="flex items-center rounded-xl border-2 border-transparent p-4 hover:border-border hover:bg-muted"
      href={props.href}
    >
      <div className="flex items-center gap-6">
        {React.createElement(icon, { className: "h-6 w-6" })}
        <div>
          <p className="font-semibold">{props.label}</p>
          <p className="text-sm font-medium text-muted-foreground">{props.description}</p>
        </div>
      </div>
    </Link>
  );
};
