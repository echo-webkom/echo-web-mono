export type Route = {
  label: string;
  href: string;
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

export const footerRoutes: Array<RouteSection> = [
  {
    label: "📞 Kontakt oss",
    sublinks: [
      {
        label: "echo@uib.no",
        href: "mailto:echo@uib.no",
      },
      {
        label: "Thormøhlens gate 55 5006 BERGEN",
        href: "https://goo.gl/maps/adUsBsoZh3QqNvA36",
      },
      {
        label: "Organisasjonsnummer: 998 995 035",
        href: "https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=998995035",
      },
      {
        label: "Opplevd noe kjipt? Si ifra!",
        href: "/for-studenter/si-ifra",
      },
    ],
  },
  {
    label: "💻 Følg oss",
    sublinks: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/echo.uib",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/echo.uib/",
      },
      {
        label: "GitHub",
        href: "https://www.linkedin.com/company/echo-uib/",
      },
    ],
  },
];
