import React from "react";

import { cn } from "@/utils/cn";

type SidebarProps = {
  className?: string;
  children: React.ReactNode;
};

export const Sidebar = ({ className, children }: SidebarProps) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div
      className={cn(
        "border-muted-dark bg-muted flex w-full flex-col gap-3 rounded-xl border-2 p-6",
        className,
      )}
    >
      {childrenArray.map((child, index) => {
        return <React.Fragment key={index}>{child}</React.Fragment>;
      })}
    </div>
  );
};

type SidebarItemProps = {
  className?: string;
  children: React.ReactNode;
};

export const SidebarItem = ({ className, children }: SidebarItemProps) => {
  return <div className={cn(className)}>{children}</div>;
};

type SidebarItemTitleProps = {
  className?: string;
  children: React.ReactNode;
};

export const SidebarItemTitle = ({ className, children }: SidebarItemTitleProps) => {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
};

type SidebarItemContentProps = {
  className?: string;
  children: React.ReactNode;
};

export const SidebarItemContent = ({ className, children }: SidebarItemContentProps) => {
  return <div className={cn(className)}>{children}</div>;
};
