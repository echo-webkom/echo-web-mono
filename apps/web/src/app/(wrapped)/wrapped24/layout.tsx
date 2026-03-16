import { Alfa_Slab_One, Lexend_Deca, Radley, Ranchers, Unna } from "next/font/google";

import { cn } from "@/utils/cn";

const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-ranchers",
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-lexend",
});

const unna = Unna({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-unna",
});

const radley = Radley({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-radley",
});

const slab = Alfa_Slab_One({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-slab",
});

export default function Wrapped24Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        ranchers.variable,
        lexendDeca.variable,
        unna.variable,
        radley.variable,
        slab.variable,
      )}
    >
      {children}
    </div>
  );
}
