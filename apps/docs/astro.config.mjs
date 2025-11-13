// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.echo-webkom.no",

  integrations: [
    starlight({
      title: "Webkom Docs",
      logo: {
        src: "./src/assets/echo-logo.png",
        replacesTitle: false,
      },
      favicon: "/favicon.ico",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/echo-webkom" }],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Velkommen",
          slug: "velkommen",
        },
        {
          label: "Tjenester",
          items: [
            {
              label: "echo-web-mono",
              items: [
                { label: "Oversikt", slug: "tjenester/echo-web-mono/oversikt" },
                { label: "Web", slug: "tjenester/echo-web-mono/web" },
                { label: "CMS", slug: "tjenester/echo-web-mono/cms" },
                { label: "API", slug: "tjenester/echo-web-mono/api" },
                { label: "Database", slug: "tjenester/echo-web-mono/database" },
                { label: "Testing", slug: "tjenester/echo-web-mono/testing" },
              ],
            },
            {
              label: "verv.echo.uib.no",
              slug: "tjenester/verv-echo",
            },
            {
              label: "screen.echo-webkom.no",
              slug: "tjenester/echo-screen",
            },
          ],
        },
        {
          label: "Guider",
          items: [
            { label: "Ordbok", slug: "guides/ordbok" },
            { label: "Homebrew Oppsett", slug: "guides/homebrew-oppsett" },
            { label: "WSL Oppsett", slug: "guides/wsl-oppsett" },
            { label: "Sette opp Git", slug: "guides/sette-opp-git" },
            { label: "VSCode Oppsett", slug: "guides/vscode-oppsett" },
            { label: "Installere Node.js (fnm)", slug: "guides/installere-fnm" },
            { label: "Installere pnpm", slug: "guides/installere-pnpm" },
          ],
        },
        {
          label: "Vertkøy",
          items: [
            {
              label: "cenv",
              slug: "tools/cenv",
            },
            {
              label: "lazygit",
              slug: "tools/lazygit",
            },
            {
              label: "GitHub CLI",
              slug: "tools/gh",
            },
          ],
        },
      ],
    }),
  ],

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },

    imageService: "compile",
  }),
});
