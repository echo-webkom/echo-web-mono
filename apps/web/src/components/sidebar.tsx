import React from "react";

import { cn } from "@/utils/cn";

type SidebarProps = {
  className?: string;
  children: React.ReactNode;
};

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children }, ref) => {
    const childrenArray = React.Children.toArray(children);

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col gap-3 rounded-xl border-2 border-muted-dark bg-muted p-6",
          className,
        )}
      >
        {childrenArray.map((child, index) => {
          return <React.Fragment key={index}>{child}</React.Fragment>;
        })}
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

type SidebarItemProps = {
  className?: string;
  children: React.ReactNode;
};

export const SidebarItem = React.forwardRef<HTMLDivElement, SidebarItemProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    );
  },
);
SidebarItem.displayName = "SidebarItem";

type SidebarItemTitleProps = {
  className?: string;
  children: React.ReactNode;
};

export const SidebarItemTitle = React.forwardRef<HTMLHeadingElement, SidebarItemTitleProps>(
  ({ className, children }, ref) => {
    return (
      <h3 ref={ref} className={cn("text-lg font-semibold", className)}>
        {children}
      </h3>
    );
  },
);
SidebarItemTitle.displayName = "SidebarItemTitle";

type SidebarItemContentProps = {
  className?: string;
  children: React.ReactNode;
};

export const SidebarItemContent = React.forwardRef<HTMLDivElement, SidebarItemContentProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    );
  },
);
SidebarItemContent.displayName = "SidebarItemContent";
