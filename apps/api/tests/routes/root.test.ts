import { describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Root route", () => {
  it("GET /", async () => {
    const res = await app.request("http://localhost:3000/");

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello, world!");
  });
});
