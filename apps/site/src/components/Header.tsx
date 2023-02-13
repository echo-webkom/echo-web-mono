import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import MenuIcon from "./MenuIcon";
import { motion } from "framer-motion";

import logo from "../../public/echo-logo-black.svg";

const links = [
  {
    href: "/",
    label: "Hjem",
  },
  {
    href: "/about",
    label: "Om echo",
  },
  {
    href: "/for-studenter",
    label: "For studenter",
  },
  {
    href: "/for-bedrifter",
    label: "For bedrifter",
  },
  {
    href: "/auth/signin",
    label: "Logg inn",
    session: false,
  },
  {
    href: "/auth/signout",
    label: "Logg ut",
    session: true,
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { pathname } = useRouter();
  const { data: userSession } = useSession();

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
    <div className={`${isOpen && "min-h-screen"} bg-neutral-200 shadow-md`}>
      <header className="mx-auto flex w-full max-w-6xl items-center px-5 py-5 md:py-5">
        <div className="flex">
          <Link href={"/"}>
            <Image className="" src={logo} alt="logo" width={75} height={75} />
          </Link>
        </div>
        <div className="flex-1" />
        <nav>
          <div className="block md:hidden" onClick={() => setIsOpen((e) => !e)}>
            <MenuIcon open={isOpen} />
          </div>

          <div className="hidden md:block">
            <ul className="flex">
              {links.map(({ href, label, session }) => {
                const isActive = pathname === href;

                if (session === !userSession) {
                  return null;
                }

                return (
                  <li key={`${href}${label}`}>
                    <Link
                      className={`rounded-xl px-3 py-2 transition-colors hover:bg-neutral-200 ${
                        isActive && "font-bold underline"
                      }`}
                      href={href}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>
      {isOpen && (
        <motion.div
          initial={{ translateY: "-100%" }}
          animate={{ translateY: "0%" }}
          exit={{ translateY: "-100%" }}
          transition={{ duration: 0.25 }}
        >
          <ul className="flex flex-col">
            {links.map(({ href, label, session }) => {
              const isActive = pathname === href;

              if (session === !userSession) {
                return null;
              }

              return (
                <li key={`${href}${label}`}>
                  <Link
                    className={`rounded-xl px-3 py-2 transition-colors hover:bg-neutral-200 ${
                      isActive && "font-bold"
                    }`}
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
