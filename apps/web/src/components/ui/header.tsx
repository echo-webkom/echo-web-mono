"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Cross2Icon, HamburgerMenuIcon} from "@radix-ui/react-icons";

import {cn} from "@/utils/cn";
import {Button} from "./button";

type HeaderContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  toggle: () => void;
};

const HeaderContext = createContext<HeaderContextType>({} as HeaderContextType);

export const HeaderProvider = ({children}: {children: React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <HeaderContext.Provider value={{isOpen, toggle, setIsOpen}}>{children}</HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);

export const Header = React.forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({children, ...props}, ref) => {
    const {isOpen, setIsOpen} = useHeader();
    const pathname = usePathname();

    useEffect(() => {
      setIsOpen(false);
    }, [pathname, setIsOpen]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }, [isOpen]);

    return (
      <header
        ref={ref}
        className={cn("z-20 w-full", {
          "fixed h-full max-h-screen overflow-y-scroll bg-background backdrop-blur-none": isOpen,
          "bg-background/80 sticky top-0 backdrop-blur-lg": !isOpen,
        })}
        {...props}
      >
        {children}
      </header>
    );
  },
);
Header.displayName = "Header";

export const TopMenu = React.forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({children, ...props}, ref) => {
    return (
      <div
        ref={ref}
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2"
        {...props}
      >
        {children}
      </div>
    );
  },
);
TopMenu.displayName = "TopMenu";

export const NavigationMenu = React.forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({children, ...props}, ref) => {
    const {isOpen, toggle} = useHeader();

    return (
      <div className="flex items-center gap-6">
        <nav ref={ref} className="flex items-center gap-4" {...props}>
          <ul className="flex items-center">{children}</ul>
        </nav>
        <button>
          {isOpen && <Cross2Icon onClick={toggle} className="h-6 w-6" />}
          {!isOpen && <HamburgerMenuIcon onClick={toggle} className="h-6 w-6" />}
        </button>
      </div>
    );
  },
);
NavigationMenu.displayName = "NavigationMenu";

type NavigationMenuItemProps = ComponentPropsWithoutRef<"li"> & {
  to: string;
};

export const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({to, children, ...props}, ref) => {
    return (
      <li ref={ref} {...props}>
        <Button variant="secondary" asChild>
          <Link href={to}>{children}</Link>
        </Button>
      </li>
    );
  },
);
NavigationMenuItem.displayName = "NavigationMenuItem";

export const ExpandedMenu = React.forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({children, ...props}, ref) => {
    const {isOpen} = useHeader();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="mx-auto grid h-fit w-full max-w-7xl grid-cols-1 gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3"
        {...props}
      >
        {children}
      </div>
    );
  },
);
ExpandedMenu.displayName = "ExpandedMenu";

export const ExpandedMenuSection = React.forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({children, ...props}, ref) => {
  return (
    <div ref={ref} className="flex w-full flex-col" {...props}>
      {children}
    </div>
  );
});
ExpandedMenuSection.displayName = "ExpandedMenuSection";

export const ExpandedMenuList = React.forwardRef<HTMLUListElement, ComponentPropsWithoutRef<"ul">>(
  ({children, ...props}, ref) => {
    return (
      <ul ref={ref} className="text-lg font-medium" {...props}>
        {children}
      </ul>
    );
  },
);
ExpandedMenuList.displayName = "ExpandedMenuList";

export const ExpandedMenuTitle = React.forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<"h3">
>(({children, ...props}, ref) => {
  return (
    <h3 ref={ref} className="mb-3 text-2xl font-bold" {...props}>
      {children}
    </h3>
  );
});
ExpandedMenuTitle.displayName = "ExpandedMenuTitle";

export const ExpandedMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({to, className, children, ...props}, ref) => {
    return (
      <li ref={ref} className={cn("w-full", className)} {...props}>
        <Link
          className="flex w-full border-l-4 border-transparent p-2 transition-colors ease-in-out hover:border-primary hover:bg-black/5"
          href={to}
        >
          {children}
        </Link>
      </li>
    );
  },
);
ExpandedMenuItem.displayName = "ExpandedMenuItem";
