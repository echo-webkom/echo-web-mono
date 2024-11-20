import { expect, test } from "vitest";

import { Registration, SpotRange, User } from "@echo-webkom/db/schemas";

import { isAvailableSpot, RegistrationWithUser } from "@/utils/is-available-spot";

test("user can register with empty happening", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "spotrange1",
      spots: 1,
      minYear: 1,
      maxYear: 5,
      happeningId: "happeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user);

  expect(result).toBe(true);
});

test("user can't register with full happening", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "spotrange1",
      spots: 3,
      minYear: 1,
      maxYear: 5,
      happeningId: "happeningId1",
    },
    {
      id: "spotrange2",
      spots: 2,
      minYear: 3,
      maxYear: 5,
      happeningId: "happeningId1",
    },
    {
      id: "spotrange3",
      spots: 0,
      minYear: 2,
      maxYear: 2,
      happeningId: "happeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 1 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user1" }),
    },
    {
      user: makeUser({ id: "user2", year: 1 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user2" }),
    },
    {
      user: makeUser({ id: "user3", year: 1 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user3" }),
    },
    {
      user: makeUser({ id: "user4", year: 2 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user4" }),
    },
    {
      user: makeUser({ id: "user5", year: 3 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user5" }),
    },
    {
      user: makeUser({ id: "user6", year: 5 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user6" }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user);

  expect(result).toBe(false);
});

test("user can register in overlapping spotrange", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "bigSpotrange",
      spots: 1,
      minYear: 1,
      maxYear: 5,
      happeningId: "happeningId1",
    },
    {
      id: "smallSpotrange",
      spots: 1,
      minYear: 3,
      maxYear: 3,
      happeningId: "happeeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 1 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user1" }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 3 });

  const result = isAvailableSpot(spotRanges, registrations, user);

  expect(result).toBe(true);
});

test("user can't register in others' spotrange", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "bigSpotrange",
      spots: 1,
      minYear: 1,
      maxYear: 5,
      happeningId: "happeningId1",
    },
    {
      id: "smallSpotrange",
      spots: 1,
      minYear: 3,
      maxYear: 3,
      happeningId: "happeeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 1 }),
      registration: makeRegistration({ happeningId: "happening1", userId: "user1" }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user);

  expect(result).toBe(false);
});

test("user can register when there is no waitlist in their spotrange", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "bigSpotrange",
      spots: 1,
      minYear: 1,
      maxYear: 5,
      happeningId: "happeningId1",
    },
    {
      id: "smallSpotrange",
      spots: 1,
      minYear: 3,
      maxYear: 3,
      happeningId: "happeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 1 }),
      registration: makeRegistration({
        happeningId: "happening1",
        userId: "user1",
        status: "waiting",
      }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 3 });
  const result = isAvailableSpot(spotRanges, registrations, user);

  expect(result).toBe(true);
});

test("user can't register with waitlist", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "bigSpotrange",
      spots: 1,
      minYear: 1,
      maxYear: 5,
      happeningId: "happeningId1",
    },
    {
      id: "smallSpotrange",
      spots: 1,
      minYear: 3,
      maxYear: 3,
      happeningId: "happeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 3 }),
      registration: makeRegistration({
        happeningId: "happening1",
        userId: "user1",
        status: "waiting",
      }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user);

  expect(result).toBe(false);
});

test("user can register with infinite spots", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "bigSpotrange",
      spots: 1,
      minYear: 1,
      maxYear: 5,
      happeningId: "happeningId1",
    },
    {
      id: "infiniteSpotrange",
      spots: 0,
      minYear: 3,
      maxYear: 3,
      happeningId: "happeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 1 }),
      registration: makeRegistration({
        happeningId: "happening1",
        userId: "user1",
        status: "waiting",
      }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 3 });

  const result = isAvailableSpot(spotRanges, registrations, user);

  expect(result).toBe(true);
});

function makeUser(params: Omit<Partial<User>, "id" | "year"> & Pick<User, "id" | "year">): User {
  return {
    id: params.id,
    email: params.email ?? "",
    name: params.name ?? "",
    type: params.type ?? "student",
    year: params.year ?? 1,
    image: params.image ?? null,
    degreeId: params.degreeId ?? null,
    isBanned: params.isBanned ?? false,
    createdAt: params.createdAt ?? null,
    updatedAt: params.updatedAt ?? null,
    hasReadTerms: params.hasReadTerms ?? true,
    lastSignInAt: params.lastSignInAt ?? null,
    emailVerified: params.emailVerified ?? null,
    alternativeEmail: params.alternativeEmail ?? null,
    bannedFromStrike: params.bannedFromStrike ?? null,
    birthday: params.birthday ?? null 
  };
}

function makeRegistration(
  params: Omit<Partial<Registration>, "happeningId" | "userId"> &
    Pick<Registration, "happeningId" | "userId">,
): Registration {
  return {
    happeningId: params.happeningId,
    userId: params.userId,
    createdAt: params.createdAt ?? new Date(),
    status: params.status ?? "registered",
    unregisterReason: params.unregisterReason ?? null,
    prevStatus: params.prevStatus ?? null,
    changedAt: params.changedAt ?? null,
    changedBy: params.changedBy ?? null,
  };
}
