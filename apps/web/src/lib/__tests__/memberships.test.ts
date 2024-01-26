import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import { isHost, isMemberOf, isWebkom, type Hostable, type TUser } from "../memberships";

const userId = crypto.randomUUID();

const user1: TUser = {
  memberships: [
    {
      groupId: "webkom",
      isLeader: false,
      userId,
    },
    {
      groupId: "tilde",
      isLeader: false,
      userId,
    },
  ],
};

const user2: TUser = {
  memberships: [
    {
      groupId: "bedkom",
      isLeader: false,
      userId,
    },
    {
      groupId: "tilde",
      isLeader: false,
      userId,
    },
  ],
};

const happening: Hostable = {
  groups: [
    {
      groupId: "webkom",
      happeningId: "happening",
    },
  ],
};

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
    expect(isHost(user1, happening)).toBe(true);
  });

  it("should not be host of happening", () => {
    expect(isHost(user2, happening)).toBe(false);
  });
});
