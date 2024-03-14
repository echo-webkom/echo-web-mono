export const KAFFE_URL = "https://kaffe.deno.dev";

export class Kaffe {
  apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async getStrikes() {
    return await fetch(`${KAFFE_URL}/`, {
      cache: "no-store",
    }).then((response) => response.text());
  }

  async strike(userId: string) {
    if (!this.apiKey) {
      throw new Error("No API key provided");
    }

    return await fetch(`${KAFFE_URL}/strike`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        userId,
      }),
    }).then((response) => response.status === 200);
  }

  async reset() {
    if (!this.apiKey) {
      throw new Error("No API key provided");
    }

    return await fetch(`${KAFFE_URL}/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    }).then((response) => response.status === 200);
  }
}
