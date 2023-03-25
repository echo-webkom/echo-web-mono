import React from "react";
import Link from "next/link";
import classNames from "classnames";

type BreadcrumbsRootProps = {
  className?: string;
  children: React.ReactNode;
};

const BreadcrumbsRoot = ({className, children}: BreadcrumbsRootProps) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={classNames(className)}>
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
            <span className="mx-2 text-gray-400">/</span>
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
      <Link className={classNames("hover:underline", className)} href={to}>
        {children}
      </Link>
    );
  }

  return <span className={classNames("underline", className)}>{children}</span>;
};
BreadcrumbsItem.displayName = "Breadcrumbs.Item";

type BreadcrumbsComposition = {
  Item: React.FC<BreadcrumbsItemProps>;
};

const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
}) as React.FC<BreadcrumbsRootProps> & BreadcrumbsComposition;

export default Breadcrumbs;
