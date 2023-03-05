type Sponsor = {
  label: string;
  href: string;
  imageSrc: string;
};

const createSponsorArray = <
  T extends readonly Sponsor[] & Array<{label: V}>,
  V extends string,
>(
  ...args: T
) => {
  return args;
};

type Label = (typeof sponsors)[number]["label"];

export const sponsors = createSponsorArray(
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
);

export const getHoverShadow = (label: Label) => {
  switch (label) {
    case "Vercel":
      return "hover:shadow-black";
    case "Sanity":
      return "hover:shadow-[#f03e2f]";
  }
};
