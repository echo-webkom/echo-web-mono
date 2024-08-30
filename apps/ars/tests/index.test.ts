import { afterEach } from "node:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { isUserBanned } from "../src/is-user-banned";
import {
  getExisitingRegistration,
  getHappening,
  getHostGroups,
  getUser,
  registerUserToHappening,
} from "../src/queries";
import { bedpres } from "./fixtures/happenings";
import { defaultRequest } from "./fixtures/request";
import { bo } from "./fixtures/users";
import { runRequest } from "./lib/run-request";

const getUserMock = vi.mocked(getUser);
const getHappeningMock = vi.mocked(getHappening);
const isUserBannedMock = vi.mocked(isUserBanned);
const getExisitingRegistrationMock = vi.mocked(getExisitingRegistration);
const getHostGroupsMock = vi.mocked(getHostGroups);
const registerUserToHappeningMock = vi.mocked(registerUserToHappening);

vi.mock("../src/queries", () => {
  return {
    getUser: vi.fn(),
    getHappening: vi.fn(),
    getExisitingRegistration: vi.fn(),
    getHostGroups: vi.fn(),
    registerUserToHappening: vi.fn(),
  };
});

vi.mock("../src/is-user-banned", () => {
  return {
    isUserBanned: vi.fn(),
  };
});

describe("ragger", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be unauthorized", async () => {
    const res = await runRequest("POST", "/", {
      headers: {
        Authorization: "Bearer invalid",
      },
    });

    expect(res.status).toBe(401);
  });

  it("should be invalid json", async () => {
    const res = await runRequest("POST", "/");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: false, message: "Ugyldig JSON" });
  });

  it("should be user not found", async () => {
    getUserMock.mockReturnValue(Promise.resolve(undefined));

    const res = await runRequest("POST", "/", defaultRequest);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: false, message: "Brukeren finnes ikke" });
  });

  it("should be incomplete user", async () => {
    getUserMock.mockReturnValue(Promise.resolve({ ...bo, hasReadTerms: false }));
    getHappeningMock.mockReturnValue(Promise.resolve(bedpres));

    const res = await runRequest("POST", "/", defaultRequest);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: false, message: "Brukeren er ikke fullført" });
  });

  it("should be banned", async () => {
    getUserMock.mockReturnValue(Promise.resolve({ ...bo, isBanned: true }));
    getHappeningMock.mockReturnValue(Promise.resolve(bedpres));
    isUserBannedMock.mockReturnValue(Promise.resolve(true));

    const res = await runRequest("POST", "/", defaultRequest);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: false, message: "Brukeren er utestengt" });
  });

  it("should be already registered", async () => {
    getUserMock.mockReturnValue(Promise.resolve(bo));
    getHappeningMock.mockReturnValue(Promise.resolve(bedpres));
    isUserBannedMock.mockReturnValue(Promise.resolve(false));
    getExisitingRegistrationMock.mockReturnValue(Promise.resolve({ status: "registered" }));

    const res = await runRequest("POST", "/", defaultRequest);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: false,
      message: "Du er allerede påmeldt dette arrangementet",
    });
    expect(getUserMock).toHaveBeenCalledWith("foo");
    expect(getHappeningMock).toHaveBeenCalledWith("bedpres");
    expect(getExisitingRegistrationMock).toHaveBeenCalledWith("foo", "bedpres");
  });

  it("should register user", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-01-02"));

    getUserMock.mockReturnValue(Promise.resolve(bo));
    getHappeningMock.mockReturnValue(Promise.resolve(bedpres));
    isUserBannedMock.mockReturnValue(Promise.resolve(false));
    getHostGroupsMock.mockReturnValue(Promise.resolve(["webkom"]));
    getExisitingRegistrationMock.mockReturnValue(Promise.resolve(undefined));
    registerUserToHappeningMock.mockReturnValue(Promise.resolve("registered"));

    const res = await runRequest("POST", "/", defaultRequest);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, message: "Du er nå påmeldt arrangementet" });
    expect(getUserMock).toHaveBeenCalledWith("foo");
    expect(getHappeningMock).toHaveBeenCalledWith("bedpres");
    expect(getExisitingRegistrationMock).toHaveBeenCalledWith("foo", "bedpres");
  });
});
