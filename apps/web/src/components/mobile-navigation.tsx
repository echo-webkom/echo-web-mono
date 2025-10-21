"use client";

import React, { createContext, useContext, useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  RxChevronDown as ChevronDown,
  RxCross2 as Cross,
  RxHamburgerMenu as HamburgerMenu,
} from "react-icons/rx";

import { useAuth } from "@/hooks/use-auth";
import { headerRoutes } from "@/lib/routes";
import { cn } from "@/utils/cn";

type NavigationContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const onNavigation = useEffectEvent(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    onNavigation();
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="md:hidden">{children}</div>
    </NavigationContext.Provider>
  );
};

const MenuButton = () => {
  const { isOpen, setIsOpen } = useNavigation();

  return (
    <button
      className="hover:bg-muted dark:text-foreground flex flex-row items-center gap-1 rounded-md p-2 text-gray-600"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="sr-only">Meny</span>
      <HamburgerMenu className="h-7 w-7" />
    </button>
  );
};

const CloseMenuButton = () => {
  const { setIsOpen } = useNavigation();

  return (
    <button
      className="text-muted-foreground hover:bg-muted flex flex-row items-center gap-1 rounded-md p-2"
      onClick={() => setIsOpen(false)}
    >
      <span className="sr-only">Lukk meny</span>
      <Cross className="h-7 w-7" />
    </button>
  );
};

const MenuContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useNavigation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -1000 }}
          animate={{ y: 0 }}
          exit={{ y: -1000 }}
          transition={{ duration: 0.5 }}
          className="bg-background dark:text-foreground fixed top-0 left-0 z-50 h-full min-h-screen w-full overflow-y-scroll px-6 pt-6 pb-24"
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
      className="hover:bg-muted dark:text-foreground block rounded-md p-4 text-2xl text-gray-600"
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
        className="hover:bg-muted dark:text-foreground flex w-full flex-row items-center gap-1 rounded-md p-4 text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-2xl">{label}</span>
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

export const MobileNavigation = () => {
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  return (
    <NavigationRoot>
      <MenuButton />

      <MenuContent>
        <div className="flex items-center justify-end">
          <CloseMenuButton />
        </div>

        {headerRoutes.map((route) => {
          if ("href" in route) {
            const targetHref = isAuthed && route.authedHref ? route.authedHref : route.href;

            return (
              <MenuLink key={route.label} to={targetHref}>
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
                      className="hover:bg-muted flex items-center rounded-lg p-4"
                      href={link.href}
                    >
                      <div className="flex items-center gap-4">
                        {React.createElement(link.icon, { className: "h-6 w-6" })}
                        <div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-100">{link.label}</p>
                            <p className="text-muted-foreground text-sm">{link.description}</p>
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
    </NavigationRoot>
  );
};
