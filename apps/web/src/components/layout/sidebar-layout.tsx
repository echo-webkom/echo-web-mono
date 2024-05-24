"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxArrowLeft as ArrowLeft } from "react-icons/rx";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType>({} as SidebarContextType);

export const useSidebar = () => {
  return useContext(SidebarContext);
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarContext.Provider>
  );
};

export function SidebarLayoutRoot({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="mx-auto flex w-full max-w-[1400px] flex-grow flex-row">{children}</div>
    </SidebarProvider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <div
      className={cn("border-r bg-background p-5 md:block", {
        "hidden md:block": !isOpen,
        "w-full md:w-auto": isOpen,
      })}
    >
      <aside className="w-full">
        <nav className="flex flex-col">
          <ul className="flex flex-col gap-1">{children}</ul>
        </nav>

        <div className="mt-5 md:hidden">
          <Button fullWidth onClick={() => setIsOpen(false)} variant="secondary">
            Lukk
          </Button>
        </div>
      </aside>
    </div>
  );
}

export function SidebarItem({ children, href }: { children: React.ReactNode; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li key={href}>
      <Link
        className={cn("flex rounded-lg px-3 py-1 text-lg font-medium hover:bg-muted", {
          "bg-muted": isActive,
        })}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

export function SidebarLayoutContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isOpen, setIsOpen } = useSidebar();

  const handleBackClick = () => {
    setIsOpen(true);
  };

  return (
    <div
      className={cn("flex w-full flex-col", {
        "hidden md:block": isOpen,
      })}
    >
      <div className="flex gap-3 border-b p-5 md:hidden">
        <button onClick={handleBackClick} className="block md:hidden">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Meny</h1>
      </div>

      {/* Page content */}
      <main className={cn(className)}>{children}</main>
    </div>
  );
}
