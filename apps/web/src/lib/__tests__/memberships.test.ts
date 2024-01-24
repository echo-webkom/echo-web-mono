import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import { isMemberOf, isWebkom, type Userable } from "../memberships";

const userId = crypto.randomUUID();

const testUser: Userable = {
  memberships: [
    {
      groupId: "webkom",
      isLeader: false,
      userId,
      group: {
        id: "webkom",
        name: "Webkom",
      },
    },
    {
      groupId: "tilde",
      isLeader: false,
      userId,
      group: {
        id: "tilde",
        name: "Tilde",
      },
    },
  ],
};

describe("user helpers", () => {
  it("should be member of webkom", () => {
    expect(isWebkom(testUser)).toBe(true);
  });

  it("should be member of tilde", () => {
    expect(isMemberOf(testUser, ["tilde", "bedkom"])).toBe(true);
  });

  it("should not be member of bedkom", () => {
    expect(isMemberOf(testUser, ["bedkom"])).toBe(false);
  });
});
