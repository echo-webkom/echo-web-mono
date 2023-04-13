import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";

import styles from "./index.module.css";

const HomepageHeader = () => {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Dokumentasjon
          </Link>
        </div>
      </div>
    </header>
  );
};

const Home = () => {
  return (
    <Layout title="echo Webkom docs" description="Dokumentasjon for echo Webkom sine tjenester.">
      <HomepageHeader />
    </Layout>
  );
};

export default Home;
