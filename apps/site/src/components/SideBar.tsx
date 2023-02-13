import Link from "next/link";
import { useState } from "react";

const links = [
  {
    href: "/",
    label: "Hjem",
  },
  {
    href: "/",
    label: "For studenter",
    sublinks: [
      {
        href: "/",
        label: "Studieinformasjon",
      },
      {
        href: "/",
        label: "Studieadministrasjon",
      },
    ],
  },
  {
    href: "/",
    label: "For bedrifter",
    sublinks: [
      {
        href: "/",
        label: "Studieinformasjon",
      },
    ],
  },
  {
    href: "/",
    label: "Undergrupper",
  },
];

const SideBar = () => {
  return (
    <div className="flex h-screen w-72 flex-col bg-gray-800 p-5 text-white">
      <ul className="flex w-full flex-col gap-2">
        {links.map(({ href, label, sublinks }) => (
          <SideBarLink
            key={`${href}${label}`}
            href={href}
            label={label}
            sublinks={sublinks}
          />
        ))}
      </ul>
    </div>
  );
};

interface SideBarLinkProps {
  href: string;
  label: string;
  sublinks?: Array<SideBarLinkProps> | undefined;
}

const SideBarLink = ({ href, label, sublinks }: SideBarLinkProps) => {
  const [open, setOpen] = useState(false);

  if (sublinks) {
    return (
      <li key={`${href}${label}`}>
        <button
          onClick={() => setOpen((val) => !val)}
          className="flex w-full rounded-md px-3 py-2 hover:bg-white/20"
        >
          {label}
        </button>
        <ul className={`gap-2 ${open ? "flex flex-col" : "hidden"}`}>
          {sublinks.map(({ href, label }) => (
            <li key={`${href}${label}`}>
              <Link
                href={href}
                className="flex rounded-md px-3 py-2 hover:bg-white/20"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li key={`${href}${label}`}>
      <Link className="flex rounded-md px-3 py-2 hover:bg-white/20" href={href}>
        {label}
      </Link>
    </li>
  );
};

export default SideBar;
