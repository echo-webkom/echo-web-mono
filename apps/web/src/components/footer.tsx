import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

import { footerRoutes } from "@/lib/routes";
import { sponsors } from "@/lib/sponsors";
import { cn } from "@/utils/cn";

type FooterProps = {
  className?: string;
};

export const Footer = ({ className }: FooterProps) => {
  return (
    <div className={cn("selection:bg-primary", className)}>
      {/* Footer wave */}
      <svg
        id="svg"
        viewBox="0 0 1440 390"
        xmlns="http://www.w3.org/2000/svg"
        className="h-40 w-full transition delay-150 duration-300 ease-in-out"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,400 C 0,400 0,200 0,200 C 65.93076923076924,224.9153846153846 131.8615384615385,249.83076923076922 205,242 C 278.1384615384615,234.16923076923078 358.4846153846154,193.59230769230768 451,181 C 543.5153846153846,168.40769230769232 648.2000000000002,183.8 737,203 C 825.7999999999998,222.2 898.7153846153847,245.20769230769233 975,244 C 1051.2846153846153,242.79230769230767 1130.9384615384615,217.36923076923074 1209,206 C 1287.0615384615385,194.63076923076926 1363.5307692307692,197.31538461538463 1440,200 C 1440,200 1440,400 1440,400 Z"
          stroke="none"
          strokeWidth="0"
          fillOpacity="1"
          className="path-0 bg-wave fill-wave transition-all delay-150 duration-300 ease-in-out"
        ></path>
      </svg>

      {/* Footer */}
      <footer className="bg-wave px-10 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap gap-10 sm:gap-20">
            {footerRoutes.map((section) => {
              return (
                <div key={section.label}>
                  <h3 className="mb-4 py-2 text-xl font-bold">{section.label}</h3>
                  <ul className="space-y-1">
                    {section.sublinks.map(({ href, label, isExternal }) => {
                      return (
                        <li key={label}>
                          <Link
                            className="flex items-center gap-2 text-black/80 hover:underline"
                            href={href}
                            {...(isExternal && {
                              target: "_blank",
                              rel: "noreferrer",
                            })}
                          >
                            {label}

                            {isExternal && (
                              <span>
                                <ExternalLinkIcon />
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            {/* Main sponsor */}
            <div>
              <h3 className="mb-4 py-2 text-xl font-bold pl-5">Hovedsamarbeidspartner 💘</h3>
              <Link href="https://bekk.no" target="_blank" rel="noreferrer">
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
              <h3 className="mb-4 py-2 text-xl font-bold">Powered by 🔧</h3>
              <ul className="space-y-5">
                {sponsors.map(({ label, href, imageSrc }) => (
                  <li key={label}>
                    <Link href={href} target="_blank" rel="noreferrer">
                      <Image src={imageSrc} height={150} width={150} alt={`${label} logo`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
