import { DBUser } from "../../src/queries";

export const bo = {
  id: "bo",
  year: 1,
  degreeId: "dsik",
  hasReadTerms: true,
  bannedFromStrike: null,
  isBanned: false,
  memberships: [],
} satisfies DBUser;

export const andreas = {
  id: "andreas",
  year: 1,
  degreeId: "dsik",
  hasReadTerms: true,
  bannedFromStrike: null,
  isBanned: false,
  memberships: [
    {
      groupId: "webkom",
    },
  ],
} satisfies DBUser;
