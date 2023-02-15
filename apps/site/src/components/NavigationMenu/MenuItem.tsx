import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  link: Link;
  isActive: boolean;
}

type Link = {
  href: string;
  label: string;
  session?: boolean;
};

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const MenuItem = ({ link, isActive }: Props) => {
  return (
    <motion.li
      variants={variants}
      // whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.99 }}
      className="flex flex-col"
    >
      <Link
        className={`px-6 py-4 transition-colors hover:bg-gray-300 ${
          isActive ? "font-semibold" : "font-thin"
        }`}
        href={link.href}
      >
        {link.label}
      </Link>
    </motion.li>
  );
};
