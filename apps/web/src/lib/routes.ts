export type Route = {
  label: string;
  href: string;
  isExternal?: boolean;
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
    label: "Arrangementer",
    href: "/arrangementer",
  },
  {
    label: "For studenter",
    sublinks: [
      {
        href: "/for-students/board",
        label: "Hovedstyret",
      },
      {
        href: "/for-students/subgroup",
        label: "Undergrupper",
      },
      {
        href: "/for-students/suborg",
        label: "Underorganisasjoner",
      },
      {
        href: "/for-students/intgroup",
        label: "Interessegrupper",
      },
      {
        href: "/for-students/job",
        label: "Stillingsannonser",
      },
      {
        href: "/for-students/post",
        label: "Innlegg",
      },
      {
        href: "/static/masterinfo",
        label: "Masterinfo",
      },
      {
        href: "/static/oekonomisk-stoette",
        label: "Økonomisk støtte",
      },
      {
        href: "/static/anonyme-tilbakemeldinger",
        label: "Tilbakemeldinger",
      },
      {
        href: "/static/utlegg",
        label: "Utlegg",
      },
      {
        href: "/static/si-ifra",
        label: "Si ifra",
      },
    ],
  },
  {
    label: "For bedrifter",
    sublinks: [
      {
        href: "/static/bedriftspresentasjon",
        label: "Bedriftspresentasjon",
      },
      {
        href: "/static/stillingsutlysninger",
        label: "Stillingsutlysninger",
      },
    ],
  },
  {
    label: "Om echo",
    sublinks: [
      {
        href: "/static/om-oss",
        label: "Hvem er vi",
      },
      {
        href: "/static/instituttraadet",
        label: "Instituttrådet",
      },
      {
        href: "/static/vedtekter",
        label: "Vedtekter",
      },
      {
        href: "/static/møtereferat",
        label: "Møtereferat",
      },
      {
        href: "/static/bekk",
        label: "Bekk",
      },
    ],
  },
  {
    href: "/auth/sign-in",
    label: "Logg inn",
    session: false,
  },
  {
    href: "/profile",
    label: "Profil",
    session: true,
  },
  {
    href: "/auth/sign-out",
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
