"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Cross2Icon, HamburgerMenuIcon} from "@radix-ui/react-icons";
import {signIn, useSession} from "next-auth/react";

import {headerRoutes} from "@/lib/routes";
import HeaderLogo from "./header-logo";
import ProfileIcon from "./profile-icon";
import {Button} from "./ui/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const {data: session} = useSession();

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="relative flex w-full flex-col bg-background">
      {/* HeaderOverlay */}
      {isOpen && (
        <div
          className="fixed left-0 top-0 z-[1] h-full w-full bg-black bg-opacity-20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Header */}
      <div className="z-30 bg-background">
        <div className="z-30 mx-auto flex w-full max-w-7xl items-center justify-between bg-background px-5 py-5 md:px-10 ">
          <div className="h-14 w-14">
            <HeaderLogo />
          </div>

          <div className="flex items-center gap-5">
            {session ? (
              <ProfileIcon session={session} />
            ) : (
              <Button onClick={() => void signIn()} variant="link">
                Logg inn
              </Button>
            )}

            <button type="button" onClick={handleToggle}>
              {!isOpen && <HamburgerMenuIcon className="h-6 w-6" />}
              {isOpen && <Cross2Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* HeaderMenu */}
      <div className="relative">
        {isOpen && (
          <div className="absolute z-20 w-full bg-background px-5 pb-20 pt-8">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
              {headerRoutes.map((route) => (
                <div key={route.label}>
                  <h3 className="mb-3 text-2xl font-bold">{route.label}</h3>
                  <ul className="grid grid-cols-1 text-lg font-medium sm:grid-cols-2 md:grid-cols-1">
                    {route.sublinks.map((subRoute) => (
                      <HeaderMenuItem key={subRoute.label} href={subRoute.href}>
                        {subRoute.label}
                      </HeaderMenuItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <hr />
    </header>
  );
}

function HeaderMenuItem({children, href}: {children: React.ReactNode; href: string}) {
  return (
    <li>
      <Link
        className="flex w-full border-l-4 border-transparent p-2 transition-colors ease-in-out hover:border-primary hover:bg-black/5"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
