import { RouteGroup } from "./route-builder";

const forStudentsRoutes = new RouteGroup("/for-studenter", { label: "For studenter" })
  .link("/arrangementer", { label: "Arrangementer" })
  .link("/jobber", { label: "Stillingsannonser" })
  .link("/innlegg", { label: "Innlegg" })
  .link("/grupper/hovedstyre", { label: "Hovedstyre" })
  .link("/grupper/undergrupper", { label: "Undergrupper" })
  .link("/grupper/underorganisasjoner", { label: "Underorganisasjoner" })
  .link("/grupper/interessegrupper", { label: "Interessegrupper" })
  .link("/grupper/idrettslag", { label: "Idrettslag" })
  .link("/motereferater", { label: "Møtereferater" })
  .link("/masterinfo", { label: "Masterinfo" })
  .link("/okonomisk-stotte", { label: "Økonomisk støtte" })
  .link("/anonyme-tilbakemeldinger", { label: "Tilbakemeldinger" })
  .link("/utlegg", { label: "Utlegg" })
  .link("/si-ifra", { label: "Si ifra" })
  .build();

const forCompaniesRoutes = new RouteGroup("/for-bedrifter", { label: "For bedrifter" })
  .link("/bedriftspresentasjon", { label: "Bedriftspresentasjon" })
  .link("/stillingsutlysninger", { label: "Stillingsutlysninger" })
  .build();

const aboutRoutes = new RouteGroup("/om", { label: "Om echo" })
  .link("/echo", { label: "Hvem er vi" })
  .link("/instituttradet", { label: "Instituttrådet" })
  .link("/vedtekter", { label: "Vedtekter" })
  .link("/bekk", { label: "Bekk" })
  .link("/brosjyre", { label: "Brosjyre" })
  .build();

const sidebarRoutes = new RouteGroup("/admin", { label: "Admin" })
  .link("/", { label: "Dashboard" })
  .link("/feedback", { label: "Tilbakemeldinger" })
  .link("/users", { label: "Brukere" })
  .build();

const contactUsRoutes = new RouteGroup("", { label: "Kontakt oss ☎️" })
  .link("mailto:echo@uib.no", {
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
  .link("/for-studenter/si-ifra", {
    label: "Opplevd noe kjipt? Si ifra!",
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

export const headerRoutes = [forStudentsRoutes, forCompaniesRoutes, aboutRoutes];
export const adminRoutes = [sidebarRoutes];
export const footerRoutes = [contactUsRoutes, followUsRoutes];
