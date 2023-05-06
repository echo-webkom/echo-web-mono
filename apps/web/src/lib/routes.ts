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

export const headerRoutes: Array<RouteSection> = [
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
        href: "/for-students/jobs",
        label: "Stillingsannonser",
      },
      {
        href: "/for-students/posts",
        label: "Innlegg",
      },
      {
        href: "/for-students/masterinfo",
        label: "Masterinfo",
      },
      {
        href: "/for-students/okonomisk-stotte",
        label: "Økonomisk støtte",
      },
      {
        href: "/for-students/anonyme-tilbakemeldinger",
        label: "Tilbakemeldinger",
      },
      {
        href: "/for-studntes/utlegg",
        label: "Utlegg",
      },
      {
        href: "/for-students/si-ifra",
        label: "Si ifra",
      },
    ],
  },
  {
    label: "For bedrifter",
    sublinks: [
      {
        href: "/for-companies/bedriftspresentasjon",
        label: "Bedriftspresentasjon",
      },
      {
        href: "/for-companies/stillingsutlysninger",
        label: "Stillingsutlysninger",
      },
    ],
  },
  {
    label: "Om echo",
    sublinks: [
      {
        href: "/about/om-echo",
        label: "Hvem er vi",
      },
      {
        href: "/about/instituttradet",
        label: "Instituttrådet",
      },
      {
        href: "/about/vedtekter",
        label: "Vedtekter",
      },
      {
        href: "/about/minutes",
        label: "Møtereferat",
      },
      {
        href: "/about/bekk",
        label: "Bekk",
      },
    ],
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
        href: "/for-students/si-ifra",
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

export const adminRoutes: Array<Route> = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Tilbakemeldinger",
    href: "/admin/feedback",
  },
  {
    label: "Brukere",
    href: "/admin/users",
  },
];
