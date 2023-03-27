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
    href: "/event",
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
        href: "/masterinfo",
        label: "Masterinfo",
      },
      {
        href: "/oekonomisk-stoette",
        label: "Økonomisk støtte",
      },
      {
        href: "/anonyme-tilbakemeldinger",
        label: "Tilbakemeldinger",
      },
      {
        href: "/utlegg",
        label: "Utlegg",
      },
      {
        href: "/si-ifra",
        label: "Si ifra",
      },
    ],
  },
  {
    label: "For bedrifter",
    sublinks: [
      {
        href: "/bedriftspresentasjon",
        label: "Bedriftspresentasjon",
      },
      {
        href: "/stillingsutlysninger",
        label: "Stillingsutlysninger",
      },
    ],
  },
  {
    label: "Om echo",
    sublinks: [
      {
        href: "/om-oss",
        label: "Hvem er vi",
      },
      {
        href: "/instituttraadet",
        label: "Instituttrådet",
      },
      {
        href: "/vedtekter",
        label: "Vedtekter",
      },
      {
        href: "/møtereferat",
        label: "Møtereferat",
      },
      {
        href: "/bekk",
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
    href: "/auth/profile",
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
        href: "https://www.facebook.com/groups/informatikk",
        isExternal: true,
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/echo_uib/",
        isExternal: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/echo-webkom/new-echo-web-monorepo",
        isExternal: true,
      },
    ],
  },
];
