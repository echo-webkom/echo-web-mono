import Link from "next/link";

const links = [
  {
    section: "Kontakt oss",
    links: [
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
    ],
  },
  {
    section: "Følg oss",
    links: [
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

export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {links.map(({section, links}) => (
            <div key={section}>
              <h3 className="mb-2 text-lg font-bold">{section}</h3>
              <ul>
                {links.map(({label, href}) => (
                  <li key={label}>
                    <Link className="hover:underline" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
