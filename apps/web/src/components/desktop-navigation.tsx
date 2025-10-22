"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FC,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { type IconBaseProps } from "react-icons";
import { RxChevronDown as ChevronDown } from "react-icons/rx";

import { useAuth } from "@/hooks/use-auth";
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
        className="hover:bg-muted dark:text-foreground flex h-10 flex-row items-center gap-1 rounded-xl p-2 font-semibold text-gray-600"
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
        className="hover:bg-muted dark:text-foreground h-10 rounded-xl p-2 font-semibold text-gray-600 hover:underline"
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

  const onNavigation = useEffectEvent(() => {
    if (!activeDropdown?.children) {
      setContentHeight(0);
      return;
    }

    setContentHeight(ref.current?.clientHeight ?? 0);
  });

  useEffect(() => {
    onNavigation();
  }, [activeDropdown]);

  return (
    <AnimatePresence>
      {activeDropdown && (
        <motion.div
          className="bg-background absolute left-0 z-20 w-full overflow-hidden border-b-2"
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
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  return (
    <NavigationList>
      {headerRoutes.map((route) => {
        if ("href" in route) {
          const targetHref = isAuthed && route.authedHref ? route.authedHref : route.href;

          return (
            <NavigationLink key={route.label} to={targetHref}>
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
      className="hover:border-border hover:bg-muted flex items-center rounded-xl border-2 border-transparent p-4"
      href={props.href}
    >
      <div className="flex items-center gap-6">
        {React.createElement(icon, { className: "h-6 w-6" })}
        <div>
          <p className="font-semibold">{props.label}</p>
          <p className="text-muted-foreground text-sm font-medium">{props.description}</p>
        </div>
      </div>
    </Link>
  );
};
