import SanityLogo from "@/assets/svg/sanity-logo.svg";
import VercelLogo from "@/assets/svg/vercel-logotype-dark.svg";

// Exact copy of next/image-types/global.d.ts
declare module "*.svg" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
}

export const sponsors = [
  {
    label: "Vercel",
    href: "https://vercel.com/?utm_source=echo-webkom&utm_campaign=oss",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    imageSrc: VercelLogo,
  },
  {
    label: "Sanity",
    href: "https://www.sanity.io/",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    imageSrc: SanityLogo,
  },
];
