import Link from "next/link";

import {footerRoutes} from "@/lib/routes";
import Image from "next/image";

const poweredBy = [
  {
    label: "Vercel",
    href: "https://vercel.com/?utm_source=echo-webkom&utm_campaign=oss",
    imageSrc: "/svg/vercel-logotype-dark.svg",
  },
  {
    label: "Sanity",
    href: "https://www.sanity.io/",
    imageSrc: "/svg/sanity-logo.svg",
  },
];

export const Footer = () => {
  return (
    <footer className="border-t px-5 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-5">
          {footerRoutes.map((route) => (
            <div key={route.label}>
              <h3 className="mb-2 text-xl font-bold">{route.label}</h3>
              <ul>
                {route.sublinks.map(({label, href}) => (
                  <li key={label}>
                    <Link className="text-black/80 hover:underline" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Main sponsor */}
          <div>
            <h3 className="mb-2 text-xl font-bold">💘 Hovedsponsor</h3>
            <Link href="https://bekk.no">
              <Image
                src="/images/bekk.png"
                className="invert"
                height={250}
                width={250}
                alt="Bekk logo"
              />
            </Link>
          </div>

          {/* Other sponsors */}
          <div>
            <h3 className="mb-2 text-xl font-bold">🔧 Powered by</h3>
            <ul className="space-y-5">
              {poweredBy.map(({label, href, imageSrc}) => (
                <li key={label}>
                  <Link href={href}>
                    <Image
                      src={imageSrc}
                      height={125}
                      width={125}
                      alt={`${label} logo`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
