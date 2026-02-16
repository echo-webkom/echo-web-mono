#!/usr/bin/env node
// @ts-check

import { appendFileSync } from "node:fs";
import { DokployClient } from "./dokploy.mjs";

// Must be set in GitHub Action secret
const DOKPLOY_URL = env("DOKPLOY_URL");
const DOKPLOY_TOKEN = env("DOKPLOY_API_TOKEN");
const AUTH_SECRET = env("AUTH_SECRET");
const FEIDE_CLIENT_ID = env("FEIDE_CLIENT_ID");
const FEIDE_CLIENT_SECRET = env("FEIDE_CLIENT_SECRET");
const ADMIN_KEY = env("PREVIEW_ADMIN_KEY");
const PREVIEW_DOMAIN = env("PREVIEW_DOMAIN");
const PREVIEW_DATABASE_PASSWORD = env("PREVIEW_DATABASE_PASSWORD");

// Comes from GitHub Actions.
const OUTPUT = env("GITHUB_OUTPUT", false);
const REGISTRY = env("REGISTRY");
const OWNER = env("GITHUB_REPOSITORY_OWNER");
const PR_NUMBER = env("PR_NUMBER");
const GIT_COMMIT_SHA = env("GIT_COMMIT_SHA");

/**
 * @param {string} name
 * @param {boolean} [required=true]
 * @returns {string}
 */
function env(name, required = true) {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

/**
 * Sets the output variable for GitHub Actions.
 * So that it can be used in later steps. Here the
 * intention is to output the URLs of the deployed preview environment.
 *
 * @param {string} key
 * @param {string} value
 */
function setOutput(key, value) {
  if (OUTPUT) {
    appendFileSync(OUTPUT, `${key}=${value}\n`);
  }
}

/**
 * @param {DokployClient} client
 * @param {string} projectName
 * @returns {Promise<any>}
 */
async function findProject(client, projectName) {
  const projects = await client.project.all();
  // @ts-expect-error Not typed
  return projects.find((p) => p.name === projectName) ?? null;
}

/**
 * @param {DokployClient} client
 * @param {string} projectId
 * @returns {Promise<{uno: any, web: any}>}
 */
async function findAppsInProject(client, projectId) {
  const project = await client.project.one(projectId);

  // @ts-expect-error Not typed
  const apps = project.environments?.flatMap((e) => e.applications ?? []) ?? [];

  // @ts-expect-error Not typed
  const uno = apps.find((a) => a.name === "uno");
  // @ts-expect-error Not typed
  const web = apps.find((a) => a.name === "web");

  return { uno, web };
}

/**
 * @param {DokployClient} client
 * @returns {Promise<boolean>}
 */
async function redeployExisting(client) {
  const projectName = `echo-web-pr-${PR_NUMBER}`;
  const project = await findProject(client, projectName);

  if (!project) {
    return false;
  }

  console.log(`Project exists (${project.projectId}), redeploying...`);
  const { uno, web } = await findAppsInProject(client, project.projectId);

  if (!uno?.applicationId || !web?.applicationId) {
    console.log("Could not find app IDs, will recreate...");
    await client.project.remove(project.projectId);
    await sleep(5000);
    return false;
  }

  console.log(`Redeploying uno (${uno.applicationId})...`);
  await client.application.redeploy(uno.applicationId);

  console.log(`Redeploying web (${web.applicationId})...`);
  await client.application.redeploy(web.applicationId);

  console.log("Redeployment triggered!");
  return true;
}

/**
 * @param {DokployClient} client
 */
async function createPreviewEnvironment(client) {
  const projectName = `echo-web-pr-${PR_NUMBER}`;
  const dbPassword = `${PREVIEW_DATABASE_PASSWORD}-${PR_NUMBER}`;

  console.log("Creating new preview environment...");

  // 1. Create project
  await client.project.create(
    projectName,
    `PR #${PR_NUMBER} preview environment`,
  );

  const project = await findProject(client, projectName);
  if (!project) {
    throw new Error(`Failed to find project "${projectName}" after creation`);
  }
  console.log(`Project created: ${project.projectId}`);

  // 2. Get environment ID (Dokploy creates a default one with the project)
  const environments = await client.environment.getByProject(project.projectId);

  let environmentId = environments?.[0]?.environmentId;
  if (!environmentId) {
    await client.environment.create("preview", project.projectId);

    const envs = await client.environment.getByProject(project.projectId);
    environmentId = envs?.[0]?.environmentId;
    if (!environmentId) {
      throw new Error(
        `Failed to find environment for project "${project.projectId}" after creation`,
      );
    }
  }
  console.log(`Environment: ${environmentId}`);

  // 3. Create and deploy PostgreSQL
  const db = await client.postgres.create({
    name: "db",
    appName: "db",
    databaseName: "echo-db",
    databaseUser: "postgres",
    databasePassword: dbPassword,
    dockerImage: "postgres:17.7",
    environmentId,
  });
  if (!db?.postgresId) {
    throw new Error(
      `postgres.create did not return a postgresId. Response: ${JSON.stringify(db)}`,
    );
  }
  console.log(`PostgreSQL created: ${db.postgresId}`);

  const pgDetails = await client.postgres.one(db.postgresId);
  const dbHost = pgDetails.appName;
  console.log(`PostgreSQL hostname: ${dbHost}`);

  await client.postgres.deploy(db.postgresId);
  console.log("Waiting for PostgreSQL to be ready...");
  await sleep(20_000);

  const databaseUrl = `postgresql://postgres:${dbPassword}@${dbHost}:5432/echo-db?sslmode=disable`;

  // 4. Deploy migrator to run migrations and seeding
  const migrator = await client.application.create(
    `migrator`,
    `migrator`,
    environmentId,
  );
  if (!migrator?.applicationId) {
    throw new Error(
      `application.create did not return an applicationId for migrator. Response: ${JSON.stringify(migrator)}`,
    );
  }
  console.log(`Migrator created: ${migrator.applicationId}`);

  await client.application.update(
    migrator.applicationId,
    "docker",
    `${REGISTRY}/${OWNER}/migrator:pr-${PR_NUMBER}`,
    [
      `DATABASE_URL=${databaseUrl}`,
      `NEXT_PUBLIC_SANITY_DATASET=develop`,
      `NEXT_PUBLIC_SANITY_PROJECT_ID=pgq2pd26`,
    ].join("\n"),
  );

  await client.application.deploy(migrator.applicationId);
  console.log("Migrator deployed, waiting for it to finish...");
  await sleep(60_000);
  await client.application.delete(migrator.applicationId);
  console.log("Migrator finished and removed.");

  // 5. Create and configure uno (backend)
  const uno = await client.application.create(`uno`, `uno`, environmentId);
  if (!uno?.applicationId) {
    throw new Error(
      `application.create did not return an applicationId for uno. Response: ${JSON.stringify(uno)}`,
    );
  }
  console.log(`Uno created: ${uno.applicationId}`);

  await client.application.update(
    uno.applicationId,
    "docker",
    `${REGISTRY}/${OWNER}/uno:pr-${PR_NUMBER}`,
    [
      `DATABASE_URL=${databaseUrl}`,
      `UNO_API_PORT=8000`,
      `ADMIN_KEY=${ADMIN_KEY}`,
      `ENVIRONMENT=staging`,
      `NEXT_PUBLIC_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}`,
    ].join("\n"),
  );

  await client.domain.create(
    `pr-${PR_NUMBER}.uno.${PREVIEW_DOMAIN}`,
    8000,
    uno.applicationId,
  );

  await client.application.deploy(uno.applicationId);
  console.log("Uno deployed!");

  // 6. Create and configure web (frontend)
  const web = await client.application.create("web", "web", environmentId);
  if (!web?.applicationId) {
    throw new Error(
      `application.create did not return an applicationId for web. Response: ${JSON.stringify(web)}`,
    );
  }
  console.log(`Web created: ${web.applicationId}`);

  await client.application.update(
    web.applicationId,
    "docker",
    `${REGISTRY}/${OWNER}/web:pr-${PR_NUMBER}`,
    [
      `DATABASE_URL=${databaseUrl}`,
      `NEXT_PUBLIC_API_URL=https://pr-${PR_NUMBER}.uno.${PREVIEW_DOMAIN}`,
      `NEXT_PUBLIC_SANITY_DATASET=develop`,
      `NEXT_PUBLIC_SANITY_PROJECT_ID=pgq2pd26`,
      `FEIDE_CLIENT_ID=${FEIDE_CLIENT_ID}`,
      `FEIDE_CLIENT_SECRET=${FEIDE_CLIENT_SECRET}`,
      `AUTH_SECRET=${AUTH_SECRET}`,
      `ADMIN_KEY=${ADMIN_KEY}`,
      `ENVIRONMENT=staging`,
      `PORT=3000`,
      `NEXT_PUBLIC_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}`,
    ].join("\n"),
  );

  await client.domain.create(
    `pr-${PR_NUMBER}.web.${PREVIEW_DOMAIN}`,
    3000,
    web.applicationId,
  );
  await client.application.deploy(web.applicationId);
  console.log("Web deployed!");
}

async function deploy() {
  const client = new DokployClient(DOKPLOY_URL, DOKPLOY_TOKEN);

  const redeployed = await redeployExisting(client);

  if (!redeployed) {
    await createPreviewEnvironment(client);
  }

  const webUrl = `https://pr-${PR_NUMBER}.web.${PREVIEW_DOMAIN}`;
  const apiUrl = `https://pr-${PR_NUMBER}.uno.${PREVIEW_DOMAIN}`;

  setOutput("web_url", webUrl);
  setOutput("api_url", apiUrl);

  console.log(`\nPreview URLs:`);
  console.log(`  Frontend: ${webUrl}`);
  console.log(`  Backend:  ${apiUrl}`);
}

async function cleanup() {
  const client = new DokployClient(DOKPLOY_URL, DOKPLOY_TOKEN);
  const projectName = `echo-web-pr-${PR_NUMBER}`;

  console.log(`Looking for project: ${projectName}`);
  const project = await findProject(client, projectName);

  if (!project) {
    console.log(
      `No preview project found for PR #${PR_NUMBER}, nothing to clean up.`,
    );
    return;
  }

  console.log(`Removing project ${project.projectId}...`);
  await client.project.remove(project.projectId);
  console.log(`Preview environment for PR #${PR_NUMBER} removed.`);
}

/**
 * Sleeps for the given number of milliseconds.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const action = process.argv[2];

if (action === "deploy") {
  await deploy();
} else if (action === "cleanup") {
  await cleanup();
} else {
  console.error(`Unknown action: ${action}. Use "deploy" or "cleanup".`);
  process.exit(1);
}
