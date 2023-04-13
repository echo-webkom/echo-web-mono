// @ts-check

// TOOD: Convert to ES6 module syntax
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const lightCodeTheme = require("prism-react-renderer/themes/github");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "echo Webkom",
  tagline: "Dokumentasjon for echo Webkom sine tjenester",
  favicon: "img/favicon.ico",

  url: "https://docs.echo-webkom.no",
  baseUrl: "/",

  organizationName: "echo-webkom",
  projectName: "new-echo-web-monorepo",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "no",
    locales: ["no"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/echo-webkom/new-echo-web-monorepo/tree/main/apps/docs/",
        },
        // blog: {
        //   showReadingTime: true,
        //   editUrl:
        //     "https://github.com/echo-webkom/<project>/...",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "echo Webkom",
        logo: {
          alt: "echo Webkom logo",
          src: "img/webkom.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Dokumentasjon",
          },
          // {to: "/blog", label: "Blog", position: "left"},
          {
            href: "https://github.com/facebook/docusaurus",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "echo - Linjeforeningen for informatikk",
            items: [
              {
                label: "Nettside",
                href: "https://echo.uib.no",
              },
              {
                label: "Instagram",
                href: "https://instagram.com/echo_uib",
              },
            ],
          },
          {
            title: "Følg oss",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/echo-webkom",
              },
              {
                label: "Instagram",
                href: "https://instagram.com/echo_webkom",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} echo Webkom. Laget med ❤️ og Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
