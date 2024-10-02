import Link from "next/link";

import { Heading } from "@/components/typography/heading";
import { cn } from "@/utils/cn";

type BentoBoxProps = {
  children?: React.ReactNode;
  title: string;
  href?: string;
  className?: string;
};

export const BentoBox = ({ title, href, children, className }: BentoBoxProps) => {
  return (
    <section className={cn("flex flex-col gap-2 rounded-md border-2 p-2", className)}>
      {href ? (
        <Link
          href={href}
          className="group relative mx-auto flex items-center underline-offset-4 hover:underline"
        >
          <Heading className="text-center text-2xl font-medium">{title}</Heading>
        </Link>
      ) : (
        <Heading className="mx-auto text-center text-2xl font-medium">{title}</Heading>
      )}

      <hr className="border-b" />

      {children}
    </section>
  );
};
