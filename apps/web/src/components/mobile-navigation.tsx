"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
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
      className="flex flex-row items-center gap-1 rounded-md p-2 text-gray-600 hover:bg-muted dark:text-foreground "
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="sr-only">Meny</span>
      <HamburgerMenuIcon className="h-7 w-7" />
    </button>
  );
};

const CloseMenuButton = () => {
  const { setIsOpen } = useNavigation();

  return (
    <button
      className="flex flex-row items-center gap-1 rounded-md p-2 text-muted-foreground hover:bg-muted"
      onClick={() => setIsOpen(false)}
    >
      <span className="sr-only">Lukk meny</span>
      <Cross2Icon className="h-7 w-7" />
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
          className="fixed left-0 top-0 z-50 h-full min-h-screen w-full overflow-y-scroll bg-background px-6 pb-24 pt-6 dark:text-foreground"
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
      className="block rounded-md p-4 text-2xl text-gray-600 hover:bg-muted dark:text-foreground"
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
        <span className="text-2xl">{label}</span>
        <span>
          <ChevronDownIcon
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
  return (
    <NavigationRoot>
      <MenuButton />

      <MenuContent>
        <div className="flex items-center justify-end">
          <CloseMenuButton />
        </div>

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
    </NavigationRoot>
  );
};
