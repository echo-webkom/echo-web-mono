import Link from "next/link";
import { LuArrowRight as ArrowRight } from "react-icons/lu";

import { Heading } from "@/components/typography/heading";
import { cn } from "@/utils/cn";

type BentoBoxProps = {
  children?: React.ReactNode;
  title: string;
  href?: string;
  className?: string;
};

export function BentoBox({ title, href, children, className }: BentoBoxProps) {
  return (
    <section className={cn("flex flex-col gap-5 rounded-md border p-5 shadow-lg", className)}>
      {href ? (
        <Link
          href={href}
          className="group mx-auto flex items-center underline-offset-4 hover:underline"
        >
          <Heading className="text-center font-medium">{title}</Heading>

          <ArrowRight className="ml-2 inline h-6 w-6 transition-transform group-hover:translate-x-2" />
        </Link>
      ) : (
        <Heading className="text-center text-3xl font-medium">{title}</Heading>
      )}

      <hr />

      {children}
    </section>
  );
}
