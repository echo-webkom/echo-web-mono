import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import { isHost, isMemberOf, isWebkom, type TUser } from "../memberships";

const userId = crypto.randomUUID();

const user1: TUser = {
  memberships: [
    {
      groupId: "webkom",
      userId,
    },
    {
      groupId: "tilde",
      userId,
    },
  ],
};

const user2: TUser = {
  memberships: [
    {
      groupId: "bedkom",
      userId,
    },
    {
      groupId: "tilde",
      userId,
    },
  ],
};

const groups = ["webkom"];

describe("user helpers", () => {
  it("should be member of webkom", () => {
    expect(isWebkom(user1)).toBe(true);
  });

  it("should be member of tilde", () => {
    expect(isMemberOf(user1, ["tilde", "bedkom"])).toBe(true);
  });

  it("should not be member of bedkom", () => {
    expect(isMemberOf(user1, ["bedkom"])).toBe(false);
  });

  it("should be host of happening", () => {
    expect(isHost(user1, groups)).toBe(true);
  });

  it("should not be host of happening", () => {
    expect(isHost(user2, groups)).toBe(false);
  });
});
