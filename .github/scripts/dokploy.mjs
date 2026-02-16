// @ts-check

export class DokployClient {
  /**
   * @param {string} url
   * @param {string} token
   */
  constructor(url, token) {
    this.baseUrl = `${url}/api`;
    this.token = token;
    this.application = new DokployApplicationClient(this);
    this.project = new DokployProjectClient(this);
    this.environment = new DokployEnvironmentClient(this);
    this.postgres = new DokployPostgresClient(this);
    this.domain = new DokployDomainClient(this);
  }

  /**
   * @param {string} method
   * @param {string} endpoint
   * @param {string | undefined=} body
   * @returns {Promise<any>}
   */
  async request(method, endpoint, body) {
    const res = await fetch(`${this.baseUrl}/${endpoint}`, {
      method,
      headers: {
        "x-api-key": this.token,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${method} ${endpoint} failed (${res.status}): ${text}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  /**
   * @param {string} endpoint
   * @returns {Promise<any>}
   */
  get(endpoint) {
    return this.request("GET", endpoint);
  }

  /**
   * @param {string} endpoint
   * @param {any} body
   * @returns {Promise<any>}
   */
  post(endpoint, body) {
    return this.request("POST", endpoint, body);
  }
}

class DokployApplicationClient {
  /**
   * @param {DokployClient} dokployClient
   */
  constructor(dokployClient) {
    this.dokployClient = dokployClient;
  }

  /**
   * @param {string} applicationId
   * @returns {Promise<any>}
   */
  async redeploy(applicationId) {
    return await this.dokployClient.post("application.redeploy", {
      applicationId,
    });
  }

  /**
   * @param {string} applicationId
   * @returns {Promise<any>}
   */
  async deploy(applicationId) {
    return await this.dokployClient.post("application.deploy", {
      applicationId,
    });
  }

  /**
   * @param {string} name
   * @param {string} appName
   * @param {string} environmentId
   * @returns {Promise<any>}
   */
  async create(name, appName, environmentId) {
    return await this.dokployClient.post("application.create", {
      name,
      appName,
      environmentId,
    });
  }

  /**
   * @param {string} applicationId
   * @param {string} sourceType
   * @param {string} dockerImage
   * @param {string=} env
   * @returns {Promise<any>}
   */
  async update(applicationId, sourceType, dockerImage, env = undefined) {
    return await this.dokployClient.post("application.update", {
      applicationId,
      sourceType,
      dockerImage,
      env,
    });
  }

  /**
   * @param {string} applicationId
   * @returns {Promise<any>}
   */
  async delete(applicationId) {
    return await this.dokployClient.post("application.delete", {
      applicationId,
    });
  }
}

class DokployProjectClient {
  /**
   * @param {DokployClient} dokployClient
   */
  constructor(dokployClient) {
    this.dokployClient = dokployClient;
  }

  /**
   * @returns {Promise<any>}
   */
  async all() {
    return await this.dokployClient.get("project.all");
  }

  /**
   * @param {string} projectId
   * @returns {Promise<any>}
   */
  async one(projectId) {
    return await this.dokployClient.get(`project.one?projectId=${projectId}`);
  }

  /**
   * @param {string} projectId
   * @returns {Promise<any>}
   */
  async remove(projectId) {
    return await this.dokployClient.post("project.remove", { projectId });
  }

  /**
   * @param {string} name
   * @param {string} description
   * @returns {Promise<any>}
   */
  async create(name, description) {
    return await this.dokployClient.post("project.create", {
      name,
      description,
    });
  }
}

class DokployEnvironmentClient {
  /**
   * @param {DokployClient} dokployClient
   */
  constructor(dokployClient) {
    this.dokployClient = dokployClient;
  }

  /**
   * @param {string} environmentId
   * @returns {Promise<any>}
   */
  async remove(environmentId) {
    return await this.dokployClient.post("environment.remove", {
      environmentId,
    });
  }

  /**
   * @param {string} projectId
   */
  async getByProject(projectId) {
    return await this.dokployClient.get(
      `environment.byProjectId?projectId=${projectId}`,
    );
  }

  /**
   * @param {string} name
   * @param {string} projectId
   */
  async create(name, projectId) {
    return await this.dokployClient.post("environment.create", {
      name,
      projectId,
    });
  }
}

class DokployPostgresClient {
  /**
   * @param {DokployClient} dokployClient
   */
  constructor(dokployClient) {
    this.dokployClient = dokployClient;
  }

  /**
   * @param {object} data
   */
  async create(data) {
    return await this.dokployClient.post("postgres.create", data);
  }

  /**
   * @param {string} postgresId
   * @returns {Promise<any>}
   */
  async one(postgresId) {
    return await this.dokployClient.get(
      `postgres.one?postgresId=${postgresId}`,
    );
  }

  /**
   * @param {string} postgresId
   */
  async deploy(postgresId) {
    await this.dokployClient.post("postgres.deploy", { postgresId });
  }

  /**
   * @param {string} postgresId
   * @param {object} data
   */
  async update(postgresId, data) {
    return await this.dokployClient.post("postgres.update", {
      postgresId,
      ...data,
    });
  }
}

class DokployDomainClient {
  /**
   * @param {DokployClient} dokployClient
   */
  constructor(dokployClient) {
    this.dokployClient = dokployClient;
  }

  /**
   * @param {string} host
   * @param {number} port
   * @param {string} applicationId
   * @returns {Promise<any>}
   */
  async create(host, port, applicationId) {
    await this.dokployClient.post("domain.create", {
      host,
      port,
      applicationId,
      https: true,
      certificateType: "letsencrypt",
    });
  }
}
