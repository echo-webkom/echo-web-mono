"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  RxChevronDown as ChevronDown,
  RxCross2 as Cross,
  RxHamburgerMenu as HamburgerMenu,
} from "react-icons/rx";

import { headerRoutes } from "@/lib/routes";
import { cn } from "@/utils/cn";

type MobileNavigationContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileNavigationContext = createContext<MobileNavigationContextType | null>(null);

const useNavigation = () => {
  const context = useContext(MobileNavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
};

const MobileNavigationOverlay = () => {
  const { isOpen, setIsOpen } = useNavigation();

  if (!isOpen) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="fixed left-0 top-0 h-full w-full bg-black bg-opacity-30"
      onClick={() => setIsOpen(false)}
    />
  );
};

export const MobileNavigationRoot = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <MobileNavigationContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <MobileNavigationOverlay />
    </MobileNavigationContext.Provider>
  );
};

export const MobileMenuButton = () => {
  const { isOpen, setIsOpen } = useNavigation();

  if (isOpen) {
    return (
      <button
        className="flex flex-row items-center gap-1 rounded-md p-2 hover:bg-muted md:hidden"
        onClick={() => setIsOpen(false)}
      >
        <span className="sr-only">Lukk meny</span>
        <Cross className="h-7 w-7" />
      </button>
    );
  }

  return (
    <button
      className="flex flex-row items-center gap-1 rounded-md p-2 text-gray-600 hover:bg-muted dark:text-foreground md:hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="sr-only">Meny</span>
      <HamburgerMenu className="h-7 w-7" />
    </button>
  );
};

const MenuContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useNavigation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute left-0 z-20 w-full border-b bg-background px-4 py-8"
          // initial={{
          //   height: 0,
          // }}
          // animate={{
          //   height: "auto",
          // }}
          // exit={{
          //   height: 0,
          // }}
          // transition={{
          //   duration: 0.3,
          // }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MenuLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { setIsOpen } = useNavigation();

  return (
    <Link
      href={to}
      className="block rounded-md p-4 text-xl text-gray-600 hover:bg-muted dark:text-foreground"
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );
};

const MenuItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="flex w-full flex-row items-center gap-1 rounded-md p-4 text-gray-600 hover:bg-muted dark:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl">{label}</span>
        <span>
          <ChevronDown
            className={cn("h-7 w-7 text-gray-400 transition duration-200 ease-in-out", {
              "rotate-180 transform": isOpen,
            })}
          />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuDropdown = ({ children }: { children: React.ReactNode }) => {
  return <ul className="w-full items-start">{children}</ul>;
};

export const MobileNavigationViewport = () => {
  return (
    <MenuContent>
      {headerRoutes.map((route) => {
        if ("href" in route) {
          return (
            <MenuLink key={route.label} to={route.href}>
              {route.label}
            </MenuLink>
          );
        }

        return (
          <MenuItem key={route.label} label={route.label}>
            <MenuDropdown>
              {route.links.map((link) => (
                <li key={link.label} className="w-full">
                  <Link
                    className="flex items-center rounded-lg p-4 hover:bg-muted"
                    href={link.href}
                  >
                    <div className="flex items-center gap-4">
                      {React.createElement(link.icon, { className: "h-6 w-6" })}
                      <div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-100">{link.label}</p>
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </MenuDropdown>
          </MenuItem>
        );
      })}
    </MenuContent>
  );
};
