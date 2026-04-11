"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/hooks/use-auth";
import { headerRoutes } from "@/lib/routes";
import { cn } from "@/utils/cn";

const BORDER_OFFSET = 4;

type NavigationContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used within a MobileNavigationRoot");
  }

  return context;
};

export const MobileNavigationRoot = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
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
      <span className="sr-only">{isOpen ? "Lukk meny" : "Meny"}</span>
      {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
    </button>
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
  return (
    <div className="md:hidden">
      <MenuButton />
    </div>
  );
};

export const MobileNavigationViewport = () => {
  const { isOpen, setIsOpen } = useNavigation();
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  const [contentHeight, setContentHeight] = useState(0);
  const [maxAvailableHeight, setMaxAvailableHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const onToggle = useEffectEvent(() => {
    if (!isOpen) {
      setContentHeight(0);
      return;
    }

    const dropdownTop = ref.current?.getBoundingClientRect().top ?? 0;
    const available = window.innerHeight - dropdownTop + BORDER_OFFSET;

    setMaxAvailableHeight(available);
    setContentHeight(available);
  });

  useEffect(() => {
    onToggle();
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-card absolute left-0 z-20 w-full overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: contentHeight }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              ref={ref}
              className="overflow-y-auto px-2 pt-4 pb-24"
              style={{ maxHeight: maxAvailableHeight > 0 ? maxAvailableHeight : undefined }}
            >
              {headerRoutes.map((route) => {
                if ("href" in route) {
                  const targetHref = isAuthed && route.authedHref ? route.authedHref : route.href;

                  return (
                    <Link
                      key={route.label}
                      href={targetHref}
                      className="hover:bg-muted dark:text-foreground block rounded-md p-4 text-2xl text-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
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
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                                {React.createElement(link.icon, { className: "h-6 w-6" })}
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-100">{link.label}</p>
                                <p className="text-muted-foreground text-sm">{link.description}</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </MenuDropdown>
                  </MenuItem>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
