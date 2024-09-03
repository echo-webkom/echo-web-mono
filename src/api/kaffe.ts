type KaffeOptions = {
  url: string;
};

export const DEFAULT_KAFFE_OPTIONS = {
  url: "https://kaffe.echo-webkom.no",
};

class Kaffe {
  apiKey?: string;
  options: KaffeOptions;

  constructor(apiKey?: string, options: KaffeOptions = DEFAULT_KAFFE_OPTIONS) {
    this.apiKey = apiKey;
    this.options = options;
  }

  /**
   * @returns The current strikes as a string
   */
  async getStrikes() {
    return await fetch(`${this.options.url}/`, {
      cache: "no-store",
    }).then((response) => response.text());
  }

  /**
   * Adds a new report to the strike list
   *
   * @param reporter the user id of the reporter
   * @returns true if the strike was successful
   */
  async strike(reporter: string) {
    if (!this.apiKey) {
      throw new Error("No API key provided");
    }

    return await fetch(`${this.options.url}/strike`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        reporter,
      }),
    }).then((response) => response.status === 200);
  }

  /**
   * Resets the strike count and reporter list
   *
   * @returns true if the reset was successful
   */
  async reset() {
    if (!this.apiKey) {
      throw new Error("No API key provided");
    }

    return await fetch(`${this.options.url}/reset`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    }).then((response) => response.status === 200);
  }
}

export const kaffeApi = new Kaffe(
  process.env.ADMIN_KEY,
  process.env.NEXT_PUBLIC_KAFFE_URL ? { url: process.env.NEXT_PUBLIC_KAFFE_URL } : undefined,
);
