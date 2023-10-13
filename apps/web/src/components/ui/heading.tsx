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
        "font-bold tracking-tight",
        {
          "text-3xl": level === 1,
          "text-2xl": level === 2,
        },
        className,
      )}
    >
      {children}
    </Comp>
  );
};
