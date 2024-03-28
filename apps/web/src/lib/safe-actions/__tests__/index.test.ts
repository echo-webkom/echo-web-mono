import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import * as mod from "@echo-webkom/auth";

import { bedkomAction, publicAction, webkomAction } from "..";
import { fakeWebkomUser } from "./fixtures";

describe("safe actions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be a public action", async () => {
    const action = publicAction.create(() => {
      return "Hello world";
    });

    expect(action).toBeDefined();

    expect(await action(undefined)).toStrictEqual({
      success: true,
      data: "Hello world",
    });
  });

  it("should parse input", async () => {
    const action = publicAction.input(z.object({ name: z.string() })).create(({ input }) => {
      return `Hello, ${input.name}!`;
    });

    expect(action).toBeDefined();

    const result = await action({ name: "John Doe" });

    expect(result).toStrictEqual({
      success: true,
      data: "Hello, John Doe!",
    });
  });

  it("should throw an error if input is invalid", async () => {
    const action = publicAction.input(z.object({ name: z.string() })).create(({ input }) => {
      return `Hello, ${input.name}!`;
    });

    expect(action).toBeDefined();

    // @ts-expect-error Testing invalid input
    const result = await action({ name: 42 });

    expect(result.success).toBe(false);
  });

  it("should throw an error if handler throws an error", async () => {
    const action = publicAction.create(() => {
      throw new Error("An error occurred");
    });

    expect(action).toBeDefined();

    const result = await action(undefined);

    expect(result).toStrictEqual({
      success: false,
      message: "An error occurred",
    });
  });

  it("should allow webkom actions for webkom members", async () => {
    vi.spyOn(mod, "auth").mockImplementationOnce(async () => await Promise.resolve(fakeWebkomUser));

    const action = webkomAction.create(() => {
      return "Hello world";
    });

    expect(action).toBeDefined();

    expect(await action(undefined)).toStrictEqual({
      success: true,
      data: "Hello world",
    });
  });

  it("should throw an error if user is not a webkom member", async () => {
    vi.spyOn(mod, "auth").mockImplementationOnce(async () => await Promise.resolve(null));

    const action = webkomAction.create(() => {
      return "Hello world";
    });

    expect(action).toBeDefined();

    const result = await action(undefined);

    expect(result).toStrictEqual({
      success: false,
      message: "Du er ikke logget inn.",
    });
  });

  it("should not allow bedkom actions for webkom members", async () => {
    vi.spyOn(mod, "auth").mockImplementationOnce(async () => await Promise.resolve(fakeWebkomUser));

    const action = bedkomAction.create(() => {
      return "Hello world";
    });

    expect(action).toBeDefined();

    const result = await action(undefined);

    expect(result).toStrictEqual({
      success: false,
      message: "Du er ikke med i Bedkom",
    });
  });
});
