import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { BiRss } from "react-icons/bi";
import { MdCommit } from "react-icons/md";
import { RxExternalLink as ExternalLink } from "react-icons/rx";

import BekkLogo from "@/assets/images/bekk.png";
import { footerRoutes } from "@/lib/routes";
import { sponsors } from "@/lib/sponsors";
import { cn } from "@/utils/cn";

type FooterProps = {
  className?: string;
};

export const Footer = ({ className }: FooterProps) => {
  return (
    <div className={cn("mt-32 selection:bg-primary", className)}>
      <footer className="relative rounded-t-[40px] border-2 border-footer-border bg-footer px-10 py-24 text-footer-foreground">
        <CommitLabel />
        <UsefulLinks />

        <div className="mx-auto flex w-full max-w-7xl">
          <div className="flex w-full flex-wrap justify-between gap-10 sm:gap-20">
            {footerRoutes.map((section) => {
              return (
                <div key={section.label}>
                  <h3 className="mb-4 py-2 text-xl font-bold">{section.label}</h3>
                  <ul className="space-y-1">
                    {section.sublinks.map(({ href, label, isExternal }) => {
                      return (
                        <li key={label}>
                          <Link
                            className="flex items-center gap-2 hover:underline"
                            href={href}
                            {...(isExternal && {
                              target: "_blank",
                              rel: "noreferrer",
                            })}
                          >
                            {label}

                            {isExternal && (
                              <span>
                                <ExternalLink />
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
              <h3 className="mb-4 py-2 text-xl font-bold">Hovedsamarbeidspartner 💘</h3>
              <Link href="https://bekk.no" target="_blank" rel="noreferrer">
                <Image
                  src={BekkLogo as StaticImport}
                  className="h-28 w-auto invert dark:invert-0"
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
                      <Image
                        src={imageSrc as StaticImport}
                        alt={`${label} logo`}
                        className={cn("h-8 w-auto", label === "Vercel" && "invert-0 dark:invert")}
                      />
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

const COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "AAAAAAAAAAAAAAAAAAAAA";
const humanSha = COMMIT_SHA.slice(0, 7);

const CommitLabel = () => {
  return (
    <div className="absolute bottom-0 left-0 p-1.5">
      <p className="font-mono text-xs text-muted-foreground">
        <a
          className="flex items-center gap-1 hover:underline"
          href={`https://github.com/echo-webkom/echo-web-mono/commit/${COMMIT_SHA}`}
        >
          <MdCommit className="inline-block h-4 w-4" />
          {humanSha}
        </a>
      </p>
    </div>
  );
};

const UsefulLinks = () => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-1.5">
      <ul className="flex flex-row gap-2 font-mono text-xs text-muted-foreground">
        <li>
          <Link className="flex items-center gap-1 hover:underline" href="/feed">
            <BiRss className="inline-block h-4 w-4" />
            RSS Feed
          </Link>
        </li>
      </ul>
    </div>
  );
};
