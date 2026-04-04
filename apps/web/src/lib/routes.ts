import {
  Atom,
  Briefcase,
  Building2,
  CalendarDays,
  CircleDollarSign,
  GraduationCap,
  Heart,
  type LucideIcon,
  MailOpen,
  Martini,
  Megaphone,
  Presentation,
  Quote,
  Scale,
  ScrollText,
  Shirt,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

import { mailTo } from "@/utils/prefixes";

import { RouteGroup } from "./route-builder";

type Route =
  | {
      label: string;
      href: string;
      authedHref?: string;
    }
  | {
      label: string;
      path: string;
      links: Array<{
        label: string;
        href: string;
        description: string;
        icon: LucideIcon;
      }>;
    };

export const headerRoutes: Array<Route> = [
  {
    label: "Hjem",
    href: "/",
    authedHref: "/hjem",
  },
  {
    label: "For studenter",
    path: "/for-studenter",
    links: [
      {
        label: "Arrangementer",
        href: "/for-studenter/arrangementer",
        description: "Oversikt over kommende og tidligere arrangementer",
        icon: CalendarDays,
      },
      {
        label: "Stillingsannonser",
        href: "/for-studenter/stillingsannonser",
        description: "Se hvilke stillingsannonsener som er tilgjengelig for studenter",
        icon: CircleDollarSign,
      },
      {
        label: "Innlegg",
        href: "/for-studenter/innlegg",
        description: "Nyheter og oppdateringer fra echo",
        icon: MailOpen,
      },
      {
        label: "Hovedstyrer",
        href: "/for-studenter/grupper/hovedstyre",
        description: "Oversikt over echos hovedstyrer",
        icon: Users,
      },
      {
        label: "Undergrupper",
        href: "/for-studenter/grupper/undergrupper",
        description: "Oversikt over undergrupper",
        icon: Users,
      },
      {
        label: "Programmerbar ↗",
        href: "https://programmer.bar",
        description: "Studentbaren for informatikkstudenter",
        icon: Martini,
      },
      {
        label: "Interessegrupper",
        href: "/for-studenter/grupper/interessegrupper",
        description: "Oversikt over interessegrupper",
        icon: Users,
      },
      {
        label: "Idrettslag",
        href: "/for-studenter/grupper/idrettslag",
        description: "Oversikt over idrettslag",
        icon: Users,
      },
      {
        label: "Møtereferater",
        href: "/for-studenter/motereferater",
        description: "Referater fra møter og generalforsamlinger i echo",
        icon: ScrollText,
      },
      {
        label: "Sitater",
        href: "/sitater",
        description: "Sitater fra hverdagen",
        icon: Quote,
      },
      {
        label: "Masterinfo",
        href: "/for-studenter/masterinfo",
        description: "Informasjon til deg som tar master",
        icon: GraduationCap,
      },
      {
        label: "Økonomisk støtte",
        href: "/for-studenter/okonomisk-stotte",
        description: "Økonmisk støtte for arrangementer og aktiviteter",
        icon: CircleDollarSign,
      },
      {
        label: "Anonyme tilbakemeldinger",
        href: "/for-studenter/anonyme-tilbakemeldinger",
        description: "Send anonyme tilbakemeldinger",
        icon: Megaphone,
      },
      {
        label: "Hyggkoms handleliste",
        href: "/for-studenter/handleliste",
        description: "Si hva du synes hyggkom burde kjøpe inn til lesesalen",
        icon: ShoppingCart,
      },
      {
        label: "Merch",
        href: "/for-studenter/merch",
        description: "Få deg noe tøff echo merch",
        icon: Shirt,
      },
      {
        label: "Utlegg",
        href: "/for-studenter/utlegg",
        description: "Sende inn faktura og utlegg",
        icon: Wallet,
      },
      {
        label: "Speak Up",
        href: "/for-studenter/speak-up",
        description: "Opplevd noe kjipt? Speak Up!",
        icon: Heart,
      },
    ],
  },
  {
    label: "For bedrifter",
    path: "/for-bedrifter",
    links: [
      {
        label: "Bedriftspresentasjon",
        href: "/for-bedrifter/bedriftspresentasjon",
        description: "Ønsker du å presentere bedriften din?",
        icon: Presentation,
      },
      {
        label: "Stillingsannonser",
        href: "/for-bedrifter/stillingsutlysninger",
        description: "Informasjon om stillingsutlysninger på våre nettsider",
        icon: Briefcase,
      },
    ],
  },
  {
    label: "Om echo",
    path: "/om",
    links: [
      {
        label: "Om oss",
        href: "/om/echo",
        description: "Om echo",
        icon: Atom,
      },
      {
        label: "Bouvet",
        href: "/om/bouvet",
        description: "Om Bouvet",
        icon: Briefcase,
      },
      {
        label: "Fonn Group",
        href: "/om/fonn-group",
        description: "Om Fonn Group",
        icon: Briefcase,
      },
      {
        label: "Instituttrådet",
        href: "/om/instituttradet",
        description: "Om instituttrådet",
        icon: Building2,
      },
      {
        label: "Vedtekter",
        href: "/om/vedtekter",
        description: "Vedtekter",
        icon: Scale,
      },
      {
        label: "Programstyrene",
        href: "/om/programstyrene",
        description: "Oversikt over programstyrene",
        icon: Users,
      },
      {
        label: "Etiske retningslinjer",
        href: "/om/retningslinjer",
        description: "Oversikt over etiske retningslinjer",
        icon: Scale,
      },
    ],
  },
];

const contactUsRoutes = new RouteGroup("", { label: "Kontakt oss ☎️" })
  .link(mailTo("echo@uib.no"), {
    label: "echo@uib.no",
    isExternal: true,
  })
  .link("https://goo.gl/maps/adUsBsoZh3QqNvA36", {
    label: "Thormøhlens gate 55 5006 BERGEN",
    isExternal: true,
  })
  .link("https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=998995035", {
    label: "Organisasjonsnummer: 998 995 035",
    isExternal: true,
  })
  .link("/for-studenter/speak-up", {
    label: "Opplevd noe kjipt? Speak up!",
    isExternal: false,
  })
  .link("/personvern", {
    label: "Personvernerklæring",
    isExternal: false,
  })
  .build();

const followUsRoutes = new RouteGroup("", { label: "Følg oss 💻" })
  .link("https://www.facebook.com/groups/informatikk", {
    label: "Facebook",
    isExternal: true,
  })
  .link("https://www.instagram.com/echo_uib/", {
    label: "Instagram",
    isExternal: true,
  })
  .link("https://github.com/echo-webkom", {
    label: "GitHub",
    isExternal: true,
  })
  .build();

export const footerRoutes = [contactUsRoutes, followUsRoutes];
