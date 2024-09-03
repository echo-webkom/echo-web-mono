import { cn } from "@/utils/cn";

type BlockquoteProps = {
  className?: string;
  children: React.ReactNode;
};

export const Blockquote = ({ className, children }: BlockquoteProps) => {
  return (
    <blockquote className={cn("border-l-4 border-gray-300 pl-4 italic", className)}>
      {children}
    </blockquote>
  );
};
