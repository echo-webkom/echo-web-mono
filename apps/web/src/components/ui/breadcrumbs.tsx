import React from "react";
import Link from "next/link";
import cn from "classnames";

const DefaultSeparator = () => <span className="text-gray-400">/</span>;

type BreadcrumbsRootProps = {
  separator?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const BreadcrumbsRoot = ({
  separator = <DefaultSeparator />,
  className,
  children,
}: BreadcrumbsRootProps) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn("my-2 flex items-center gap-2 text-sm md:text-base", className)}>
      {childrenArray.map((child, index) => {
        // Don't render anything if the child is not a Breadcrumbs.Item
        if (!React.isValidElement(child) || child.type !== BreadcrumbsItem) {
          return null;
        }

        // Render the last child without a separator
        if (index === childrenArray.length - 1) {
          return child;
        }

        // Render the child with a separator
        return (
          <React.Fragment key={index}>
            {child}
            {separator}
          </React.Fragment>
        );
      })}
    </div>
  );
};
BreadcrumbsRoot.displayName = "Breadcrumbs";

type BreadcrumbsItemProps = {
  className?: string;
  to?: string;
  children: React.ReactNode;
};

const BreadcrumbsItem = ({className, to, children}: BreadcrumbsItemProps) => {
  if (to) {
    return (
      <Link className={cn("hover:underline", className)} href={to}>
        {children}
      </Link>
    );
  }

  return <span className={cn("underline", className)}>{children}</span>;
};
BreadcrumbsItem.displayName = "Breadcrumbs.Item";

type BreadcrumbsComposition = {
  Item: React.FC<BreadcrumbsItemProps>;
};

const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
}) as React.FC<BreadcrumbsRootProps> & BreadcrumbsComposition;

export default Breadcrumbs;
