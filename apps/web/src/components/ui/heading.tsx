import { cn } from "@/utils/cn";

export type HeadingProps = {
  level?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
};

export const Heading = ({ level = 1, className, children }: HeadingProps) => {
  const Comp = `h${level}` as const;

  return (
    <Comp
      className={cn(
        "mb-5 scroll-m-20 font-extrabold tracking-tight",
        {
          "text-5xl": level === 1,
          "text-4xl": level === 2,
          "text-3xl": level === 3,
          "text-2xl": level === 4,
        },
        className,
      )}
    >
      {children}
    </Comp>
  );
};
