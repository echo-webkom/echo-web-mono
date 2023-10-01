class Bat {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(path: string, options?: RequestInit) {
    return await fetch(this.baseUrl + path, {
      credentials: "include",
      ...options,
    });
  }

  async post(path: string, body: unknown, options?: RequestInit) {
    return await fetch(this.baseUrl + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
      ...options,
    });
  }

  async patch(path: string, body: unknown, options?: RequestInit) {
    return await fetch(this.baseUrl + path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
      ...options,
    });
  }
}

export const bat = new Bat("http://localhost:3003");
