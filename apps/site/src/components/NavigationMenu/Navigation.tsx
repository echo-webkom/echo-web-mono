import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Props {
  links: Link[];
  toggle: () => void;
}

type Link = {
  href: string;
  label: string;
  session?: boolean;
};

const variants = {
  open: {
    opacity: 1,
    x: "0%",
    transition: { duration: 0.33, staggerChildren: 0.05, delayChildren: 0.25 },
  },
  closed: {
    opacity: 0,
    x: "-100%",
    transition: { duration: 0.33, staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = ({ links, toggle }: Props) => {
  const { pathname } = useRouter();
  const { data: userSession } = useSession();

  return (
    <motion.ul
      variants={variants}
      exit={{ translateX: "100%" }}
      onClick={() => toggle()}
      className="absolute top-24 -right-0 bottom-0 w-screen bg-gray-200"
    >
      {links.map(({ href, label, session }) => {
        const isActive = pathname === href;

        if (session === !userSession) {
          return null;
        }
        return (
          <div key={`${href}${label}`} className="overflow-hidden">
            <MenuItem link={{ href, label, session }} isActive={isActive} />
          </div>
        );
      })}
    </motion.ul>
  );
};
