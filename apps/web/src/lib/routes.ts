import { mailTo } from "@/utils/prefixes";
import { RouteGroup } from "./route-builder";

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
