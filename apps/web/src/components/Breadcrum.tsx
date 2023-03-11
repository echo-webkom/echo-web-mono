import classNames from "classnames";
import Link from "next/link";

interface BreadcrumProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export const Breadcrum = ({className, links}: BreadcrumProps) => {
  return (
    <div className={classNames(className)}>
      {links.map((link, index) => (
        <span key={index}>
          <Link
            className={classNames("hover:underline", index === links.length - 1 && "underline")}
            href={link.href}
          >
            {link.label}
          </Link>
          {index !== links.length - 1 && " / "}
        </span>
      ))}
    </div>
  );
};
