import React from "react";

import {cn} from "@/utils/cn";

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({className, children}, ref) => {
    const childrenArray = React.Children.toArray(children);

    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full flex-col gap-3 lg:max-w-[250px]", className)}
      >
        {childrenArray.map((child, index) => {
          if (!React.isValidElement(child) || child.type !== SidebarItem) {
            return null;
          }

          return <React.Fragment key={index}>{child}</React.Fragment>;
        })}
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

interface SidebarItemProps {
  className?: string;
  children: React.ReactNode;
}

export const SidebarItem = React.forwardRef<HTMLDivElement, SidebarItemProps>(
  ({className, children}, ref) => {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    );
  },
);
SidebarItem.displayName = "SidebarItem";

interface SidebarItemTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const SidebarItemTitle = React.forwardRef<HTMLHeadingElement, SidebarItemTitleProps>(
  ({className, children}, ref) => {
    return (
      <h3 ref={ref} className={cn("text-lg font-semibold", className)}>
        {children}
      </h3>
    );
  },
);
SidebarItemTitle.displayName = "SidebarItemTitle";

interface SidebarItemContentProps {
  className?: string;
  children: React.ReactNode;
}

export const SidebarItemContent = React.forwardRef<HTMLDivElement, SidebarItemContentProps>(
  ({className, children}, ref) => {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    );
  },
);
SidebarItemContent.displayName = "SidebarItemContent";
