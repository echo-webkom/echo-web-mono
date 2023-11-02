"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const adminRoutes = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/tilbakemeldinger",
    label: "Tilbakemeldinger",
  },
  {
    href: "/admin/brukere",
    label: "Brukere",
  },
  {
    href: "/admin/happenings",
    label: "Happenings",
  },
  {
    href: "/admin/grupper",
    label: "Grupper",
  },
  {
    href: "/admin/studieretninger",
    label: "Studieretninger",
  },
  {
    href: "/admin/whitelist",
    label: "Whitelist",
  },
];

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleBackClick = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative mx-auto flex w-full max-w-[1400px]">
      {/* Sidebar */}
      <div
        className={cn("border-r bg-background p-5 md:block", {
          "hidden md:block": !isOpen,
          "w-full md:w-auto": isOpen,
        })}
      >
        <aside className="w-full">
          <nav className="flex flex-col">
            <ul className="flex flex-col gap-1">
              {adminRoutes.map((route) => (
                <li key={route.href}>
                  <Link
                    className={cn("flex rounded-lg px-3 py-1 text-lg font-medium hover:bg-muted", {
                      "bg-muted": isActive(route.href),
                    })}
                    href={route.href}
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5 md:hidden">
            <Button fullWidth onClick={() => setIsOpen(false)} variant="secondary">
              Lukk
            </Button>
          </div>
        </aside>
      </div>

      {/* Page title */}
      <div
        className={cn("flex w-full flex-col", {
          "hidden md:block": isOpen,
        })}
      >
        <div className="flex gap-3 border-b p-5 md:hidden">
          <button onClick={handleBackClick} className="block md:hidden">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">Meny</h1>
        </div>

        {/* Page content */}
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}
