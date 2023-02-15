import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { motion, useCycle } from "framer-motion";
import logo from "../../public/echo-logo-black.svg";
import { MenuToggle } from "./NavigationMenu/MenuToggle";
import { Navigation } from "./NavigationMenu/Navigation";

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

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const dropDownMenu = {
  open: {
    clipPath: `circle(${1000 * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { pathname } = useRouter();
  const { data: userSession } = useSession();
  const [open, toggleOpen] = useCycle(false, true);

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
    <div
      className={`${
        isOpen && "min-h-screen"
      } z-10 border-b border-echo-black bg-neutral-200`}
    >
      <header className="mx-auto flex w-full max-w-6xl items-center px-5 py-5 md:py-5">
        <div className="flex">
          <Link href={"/"}>
            <Image className="" src={logo} alt="logo" width={75} height={75} />
          </Link>
        </div>
        <div className="flex-1" />
        <nav>
          <div className="block md:hidden">
            <motion.nav initial={false} animate={open ? "open" : "closed"}>
              <motion.div variants={dropDownMenu} />
              <Navigation links={links} toggle={() => toggleOpen()} />
              <MenuToggle toggle={() => toggleOpen()} />
            </motion.nav>
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
    </div>
  );
};

export default Navbar;
