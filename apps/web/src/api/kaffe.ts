type KaffeOptions = {
  url: string;
};

export const DEFAULT_KAFFE_OPTIONS = {
  url: "https://kaffe.omfj.workers.dev",
};

class Kaffe {
  apiKey?: string;
  options: KaffeOptions;

  constructor(apiKey?: string, options: KaffeOptions = DEFAULT_KAFFE_OPTIONS) {
    this.apiKey = apiKey;
    this.options = options;
  }

  async getStrikes() {
    return await fetch(`${this.options.url}/`, {
      cache: "no-store",
    }).then((response) => response.text());
  }

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
  process.env.KAFFE_API_KEY,
  process.env.KAFFE_URL ? { url: process.env.KAFFE_URL } : undefined,
);
