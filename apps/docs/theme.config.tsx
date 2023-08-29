import React from "react";
import Image from "next/image";
import { useConfig, type DocsThemeConfig } from "nextra-theme-docs";

const config = {
  logo: (
    <>
      <div className="header-logo">
        <Image src="/images/webkom.png" alt="echo Webkom" width={48} height={48} />
        <span>echo Webkom</span>
      </div>
      <style>{`
        .header-logo {
          display: flex;
          align-items: center;
        }
        .header-logo span {
          font-weight: 600;
          font-size: 1rem;
          margin-left: 0.25rem;
        }
      `}</style>
    </>
  ),
  project: {
    link: "https://github.com/echo-webkom",
  },
  head: function useHead() {
    const { title } = useConfig();
    const metaDescription = "Dokumentasjon for echo Webkom";
    const siteUrl = "https://docs.echo-webkom.no";

    return (
      <>
        <title>{title ? title + " - echo Webkom Docs" : "echo Webkom Docs"}</title>
        <meta charSet="utf-8" />
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content={metaDescription} />
        <meta name="og:description" content={metaDescription} />
        <meta name="twitter:site:domain" content={siteUrl} />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="og:title" content={title ? title + " - echo Webkom" : "echo Webkom"} />
        <meta name="apple-mobile-web-app-title" content="echo Webkom" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </>
    );
  },
  docsRepositoryBase: "https://github.com/echo-webkom/new-echo-web-monorepo/tree/main/apps/docs",
  editLink: {
    text: "Rediger siden på GitHub →",
  },
  feedback: {
    content: "Spørsmål? Gi oss tilbakemelding →",
    labels: "feedback",
  },
  footer: {
    text: "Dokumentasjon for echo Webkom",
  },
  banner: {
    dismissible: true,
    key: "echo-webkom-announcement",
    text: (
      <p>
        Vi søker nye medlemmer!{" "}
        <a className="underline hover:no-underline" href="https://verv.echo-webkom.no">
          Les mer her
        </a>
      </p>
    ),
  },
} satisfies DocsThemeConfig;

export default config;
