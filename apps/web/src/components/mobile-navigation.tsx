"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      <div className="mt-auto px-6 py-2 md:hidden">{children}</div>
    </NavigationContext.Provider>
  );
};

const MenuButton = () => {
  const { isOpen, setIsOpen } = useNavigation();

  return (
    <button
      className="flex flex-row items-center gap-1 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
      className="flex flex-row items-center gap-1 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      onClick={() => setIsOpen(false)}
    >
      <span className="sr-only">Lukk meny</span>
      <Cross2Icon className="h-7 w-7" />
    </button>
  );
};

const MenuContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useNavigation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 z-50 h-full min-h-screen w-full overflow-y-scroll bg-background p-6">
      {children}
    </div>
  );
};

const MenuLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { setIsOpen } = useNavigation();

  return (
    <Link
      href={to}
      className="block px-4 py-2 text-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
        className="flex w-full flex-row items-center gap-1 rounded-md px-4 py-2 text-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <span>
          <ChevronDownIcon
            className={cn("h-4 w-4 transition duration-200 ease-in-out", {
              "rotate-180 transform": isOpen,
            })}
          />
        </span>
      </button>

      {isOpen && children}
    </div>
  );
};

const MenuDropdown = ({ children }: { children: React.ReactNode }) => {
  return <ul className="w-full items-start divide-y px-6">{children}</ul>;
};

export const MobileNavigation = () => {
  return (
    <NavigationRoot>
      <MenuButton />

      <MenuContent>
        <div className="flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-gray-700">Navigasjon</h1>

          <CloseMenuButton />
        </div>

        <MenuLink to="/">Hjem</MenuLink>
        {headerRoutes.map((route) => (
          <MenuItem key={route.label} label={route.label}>
            <MenuDropdown>
              {route.sublinks.map((subRoute) => (
                <li key={subRoute.label} className="w-full py-2">
                  <Link
                    className="block w-full text-lg text-gray-600 hover:text-gray-900 hover:underline"
                    href={subRoute.href}
                  >
                    {subRoute.label}
                  </Link>
                </li>
              ))}
            </MenuDropdown>
          </MenuItem>
        ))}
      </MenuContent>
    </NavigationRoot>
  );
};
