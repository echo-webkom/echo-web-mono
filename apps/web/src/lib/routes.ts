export type Route = {
  label: string;
  href: string;
  session?: boolean;
};

export type Section = {
  label: string;
  sublinks: Array<Route>;
  session?: boolean;
};

export type NavItem = Route | Section;

export const routes: Array<NavItem> = [
  {
    label: "Hjem",
    href: "/",
  },
  {
    label: "For studenter",
    sublinks: [
      {
        href: "/for-studenter/hovedstyret",
        label: "Hovedstyret",
      },
      {
        href: "/for-studenter/undergrupper",
        label: "Undergrupper",
      },
      {
        href: "/for-studenter/underorganisasjoner",
        label: "Underorganisasjoner",
      },
      {
        href: "/for-studenter/interessegrupper",
        label: "Interessegrupper",
      },
      {
        href: "/for-studenter/masterinfo",
        label: "Masterinfo",
      },
      {
        href: "/for-studenter/okonomisk-stotte",
        label: "Økonomisk støtte",
      },
      {
        href: "/for-studenter/tilbakemeldinger",
        label: "Tilbakemeldinger",
      },
      {
        href: "/for-studenter/utlegg",
        label: "Utlegg",
      },
      {
        href: "/for-studenter/si-ifra",
        label: "Si ifra",
      },
    ],
  },
  {
    label: "For bedrifter",
    sublinks: [
      {
        href: "/for-bedrifter/bedriftspresentasjon",
        label: "Bedriftspresentasjon",
      },
      {
        href: "/for-bedrifter/stillingsannonser",
        label: "Stillingsannonser",
      },
    ],
  },
  {
    label: "Om echo",
    sublinks: [
      {
        href: "/for-studenter/hvem-er-vi",
        label: "Hvem er vi",
      },
      {
        href: "/for-studenter/instituttrådet",
        label: "Instituttrådet",
      },
      {
        href: "/for-studenter/vedtekter",
        label: "Vedtekter",
      },
      {
        href: "/for-studenter/møtereferat",
        label: "Møtereferat",
      },
      {
        href: "/for-studenter/bekk",
        label: "Bekk",
      },
    ],
  },
  {
    href: "/auth/signin",
    label: "Logg inn",
    session: false,
  },
  {
    href: "/auth/signout",
    label: "Logg ut",
    session: true,
  },
];
