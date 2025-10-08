import { cn } from "@/utils/cn";

export const Box = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-muted space-y-4 rounded-lg border px-3 py-8", className)}>{children}</div>
);
