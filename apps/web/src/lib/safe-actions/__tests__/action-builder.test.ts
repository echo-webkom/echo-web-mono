import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createAction } from "../action-builder";

describe("action builder", () => {
  it("should create action", () => {
    const action = createAction();

    expect(action).toBeDefined();
    expect(action).toHaveProperty("create");
    expect(action).toHaveProperty("input");
  });

  it("should create action with context", async () => {
    const action = createAction({
      createContext: async () => {
        return await Promise.resolve("context");
      },
    });

    expect(action).toBeDefined();
    expect(action).toHaveProperty("create");
    expect(action).toHaveProperty("input");
    expect(action.ctxFn).toBeDefined();

    const func = action.create(({ ctx }) => {
      return ctx;
    });

    expect(func).toBeDefined();
    expect(await func()).toStrictEqual({
      success: true,
      data: "context",
    });
  });

  it("should throw an error if error occurs in createContext", async () => {
    const action = createAction({
      createContext: async () => {
        throw new Error("An error occurred");

        return await Promise.resolve("context");
      },
    });

    expect(action).toBeDefined();
    expect(action).toHaveProperty("create");
    expect(action).toHaveProperty("input");
    expect(action.ctxFn).toBeDefined();

    const func = action.create(({ ctx }) => {
      return ctx;
    });

    expect(func).toBeDefined();
    expect(await func()).toStrictEqual({
      success: false,
      message: "An error occurred",
    });
  });

  it("should create action with input", async () => {
    const action = createAction();

    expect(action).toBeDefined();
    expect(action).toHaveProperty("create");
    expect(action).toHaveProperty("input");

    const func = action.input(z.string()).create(({ input }) => {
      return input;
    });

    expect(func).toBeDefined();
    expect(await func("Hello world")).toStrictEqual({
      success: true,
      data: "Hello world",
    });
  });

  it("should be able to handle multiple actions", async () => {
    const action = createAction();

    expect(action).toBeDefined();
    expect(action).toHaveProperty("create");
    expect(action).toHaveProperty("input");

    const func1 = action.input(z.string()).create(({ input }) => {
      return input;
    });

    const func2 = action.input(z.number()).create(({ input }) => {
      return input;
    });

    expect(func1).toBeDefined();
    expect(func2).toBeDefined();

    expect(await func1("Hello world")).toStrictEqual({
      success: true,
      data: "Hello world",
    });

    expect(await func2(123)).toStrictEqual({
      success: true,
      data: 123,
    });
  });
});
