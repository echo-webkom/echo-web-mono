import {motion} from "framer-motion";

interface Props {
  toggle: () => void;
}

export const MenuToggle = ({toggle}: Props) => (
  <button
    onClick={toggle}
    className="border-echo-black flex h-12 w-12 items-center justify-center rounded-full border bg-white pt-1"
  >
    <svg width="22" height="22" viewBox="0 0 22 22">
      <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        variants={{
          closed: {d: "M 2 2.5 L 20 2.5"},
          open: {d: "M 3 16.5 L 17 2.5"},
        }}
      />
      <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: {opacity: 1},
          open: {opacity: 0},
        }}
        transition={{duration: 0.1}}
      />
      <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        variants={{
          closed: {d: "M 2 16.346 L 20 16.346"},
          open: {d: "M 3 2.5 L 17 16.346"},
        }}
      />
    </svg>
  </button>
);
