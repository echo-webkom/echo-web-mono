import {forwardRef, type HTMLAttributes} from "react";

import {cn} from "@/utils/cn";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  layout?: "normal" | "full";
  children: React.ReactNode;
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({layout = "normal", className, children, ...props}, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8",
          {
            "max-w-[1200px]": layout === "normal",
            "max-w-full": layout === "full",
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Container.displayName = "Container";
