export type Route = {
  label: string;
  href: string;
  isExternal: boolean;
  session?: boolean;
};

export type RouteSection = {
  label: string;
  sublinks: Array<Route>;
  session?: boolean;
};

export type NavItem = Route | RouteSection;

export const headerRoutes: Array<NavItem> = [
  {
    label: "Hjem",
    href: "/",
    isExternal: false,
  },
  {
    label: "Arrangementer",
    href: "/arrangementer",
    isExternal: false,
  },
  {
    label: "For studenter",
    sublinks: [
      {
        href: "/for-studenter/hovedstyret",
        label: "Hovedstyret",
        isExternal: false,
      },
      {
        href: "/for-studenter/undergrupper",
        label: "Undergrupper",
        isExternal: false,
      },
      {
        href: "/for-studenter/underorganisasjoner",
        label: "Underorganisasjoner",
        isExternal: false,
      },
      {
        href: "/for-studenter/interessegrupper",
        label: "Interessegrupper",
        isExternal: false,
      },
      {
        href: "/job",
        label: "Stillingsannonser",
        isExternal: false,
      },
      {
        href: "/for-studenter/masterinfo",
        label: "Masterinfo",
        isExternal: false,
      },
      {
        href: "/for-studenter/okonomisk-stotte",
        label: "Økonomisk støtte",
        isExternal: false,
      },
      {
        href: "/for-studenter/tilbakemeldinger",
        label: "Tilbakemeldinger",
        isExternal: false,
      },
      {
        href: "/for-studenter/utlegg",
        label: "Utlegg",
        isExternal: false,
      },
      {
        href: "/for-studenter/si-ifra",
        label: "Si ifra",
        isExternal: false,
      },
    ],
  },
  {
    label: "For bedrifter",
    sublinks: [
      {
        href: "/for-bedrifter/bedriftspresentasjon",
        label: "Bedriftspresentasjon",
        isExternal: false,
      },
      {
        href: "/for-bedrifter/stillingsannonser",
        label: "Stillingsannonser",
        isExternal: false,
      },
    ],
  },
  {
    label: "Om echo",
    sublinks: [
      {
        href: "/for-studenter/hvem-er-vi",
        label: "Hvem er vi",
        isExternal: false,
      },
      {
        href: "/for-studenter/instituttrådet",
        label: "Instituttrådet",
        isExternal: false,
      },
      {
        href: "/for-studenter/vedtekter",
        label: "Vedtekter",
        isExternal: false,
      },
      {
        href: "/for-studenter/møtereferat",
        label: "Møtereferat",
        isExternal: false,
      },
      {
        href: "/for-studenter/bekk",
        label: "Bekk",
        isExternal: false,
      },
    ],
  },
  {
    href: "/auth/signin",
    label: "Logg inn",
    session: false,
    isExternal: false,
  },
  {
    href: "/auth/signout",
    label: "Logg ut",
    session: true,
    isExternal: false,
  },
];

export const footerRoutes: Array<RouteSection> = [
  {
    label: "📞 Kontakt oss",
    sublinks: [
      {
        label: "echo@uib.no",
        href: "mailto:echo@uib.no",
        isExternal: true,
      },
      {
        label: "Thormøhlens gate 55 5006 BERGEN",
        href: "https://goo.gl/maps/adUsBsoZh3QqNvA36",
        isExternal: true,
      },
      {
        label: "Organisasjonsnummer: 998 995 035",
        href: "https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=998995035",
        isExternal: true,
      },
      {
        label: "Opplevd noe kjipt? Si ifra!",
        href: "/for-studenter/si-ifra",
        isExternal: false,
      },
    ],
  },
  {
    label: "💻 Følg oss",
    sublinks: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/echo.uib",
        isExternal: true,
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/echo.uib/",
        isExternal: true,
      },
      {
        label: "GitHub",
        href: "https://www.linkedin.com/company/echo-uib/",
        isExternal: true,
      },
    ],
  },
];
