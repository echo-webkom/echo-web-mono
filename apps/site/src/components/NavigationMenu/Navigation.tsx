import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Props {
  links: Link[];
}

type Link = {
  href: string;
  label: string;
  session?: boolean;
};

const variants = {
  open: {
    opacity: 1,
    transition: { duration: 0.25, staggerChildren: 0.05, delayChildren: 0.25 },
  },
  closed: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = ({ links }: Props) => {
  const { pathname } = useRouter();
  const { data: userSession } = useSession();

  return (
    <motion.ul
      variants={variants}
      exit={{ translateX: "100%" }}
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

const itemIds = [0, 1, 2, 3, 4];
