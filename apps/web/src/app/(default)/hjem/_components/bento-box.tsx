import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/utils/cn";

type BentoBoxProps = {
  children?: React.ReactNode;
  title: string;
  href?: string;
  className?: string;
};

export const BentoBox = ({ title, href, children, className }: BentoBoxProps) => {
  return (
    <section
      className={cn("flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm", className)}
    >
      <div className="flex items-center border-b px-5 py-3">
        {href ? (
          <Link
            href={href}
            className="group flex items-center gap-1 underline-offset-4 hover:underline"
          >
            <span className="text-lg font-semibold">{title}</span>
            <ChevronRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span className="text-lg font-semibold">{title}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">{children}</div>
    </section>
  );
};
