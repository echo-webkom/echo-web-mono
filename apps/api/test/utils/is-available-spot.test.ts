import { expect, test } from "vitest";

import { Registration, SpotRange } from "@echo-webkom/db/schemas";

import { isAvailableSpot, RegistrationWithUser, UserWithIsHost } from "@/utils/is-available-spot";

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

  const result = isAvailableSpot(spotRanges, registrations, user, false);

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
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 1 }),
      ...makeRegistration({ happeningId: "happening1", userId: "user1" }),
    },
    {
      user: makeUser({ id: "user2", year: 1 }),
      ...makeRegistration({ happeningId: "happening1", userId: "user2" }),
    },
    {
      user: makeUser({ id: "user3", year: 1 }),
      ...makeRegistration({ happeningId: "happening1", userId: "user3" }),
    },
    {
      user: makeUser({ id: "user4", year: 1, isHost: true }),
      ...makeRegistration({ happeningId: "happening1", userId: "user4" }),
    },
    {
      user: makeUser({ id: "user5", year: 3 }),
      ...makeRegistration({ happeningId: "happening1", userId: "user5" }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user, true);

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
      ...makeRegistration({ happeningId: "happening1", userId: "user1" }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 3 });

  const result = isAvailableSpot(spotRanges, registrations, user, false);

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
      ...makeRegistration({ happeningId: "happening1", userId: "user1" }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user, false);

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
      ...makeRegistration({
        happeningId: "happening1",
        userId: "user1",
        status: "waiting",
      }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 3 });
  const result = isAvailableSpot(spotRanges, registrations, user, false);

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
      ...makeRegistration({
        happeningId: "happening1",
        userId: "user1",
        status: "waiting",
      }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user, true);

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
      ...makeRegistration({
        happeningId: "happening1",
        userId: "user1",
        status: "waiting",
      }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 3 });

  const result = isAvailableSpot(spotRanges, registrations, user, false);

  expect(result).toBe(true);
});

test("user can register in other spotrange if canSkip is true", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "smallSpotrange",
      spots: 1,
      minYear: 3,
      maxYear: 3,
      happeningId: "happeeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user, true);

  expect(result).toBe(true);
});

test("user can't register in full spotrange even if canSkip is true", () => {
  const spotRanges: Array<SpotRange> = [
    {
      id: "smallSpotrange",
      spots: 2,
      minYear: 3,
      maxYear: 3,
      happeningId: "happeeningId1",
    },
  ];

  const registrations: Array<RegistrationWithUser> = [
    {
      user: makeUser({ id: "user1", year: 3 }),
      ...makeRegistration({ happeningId: "happening1", userId: "user1" }),
    },
    {
      user: makeUser({ id: "user2", year: 1, isHost: true }),
      ...makeRegistration({ happeningId: "happening1", userId: "user2" }),
    },
  ];

  const user = makeUser({ id: "currentuser", year: 1 });

  const result = isAvailableSpot(spotRanges, registrations, user, true);

  expect(result).toBe(false);
});

function makeUser(
  params: Omit<Partial<UserWithIsHost>, "id" | "year"> & Pick<UserWithIsHost, "id" | "year">,
): UserWithIsHost {
  return {
    id: params.id,
    email: params.email ?? "",
    name: params.name ?? "",
    type: params.type ?? "student",
    year: params.year ?? 1,
    image: params.image ?? null,
    degreeId: params.degreeId ?? null,
    createdAt: params.createdAt ?? null,
    updatedAt: params.updatedAt ?? null,
    hasReadTerms: params.hasReadTerms ?? true,
    lastSignInAt: params.lastSignInAt ?? null,
    inactiveEmailSentAt: params.inactiveEmailSentAt ?? null,
    emailVerified: params.emailVerified ?? null,
    alternativeEmail: params.alternativeEmail ?? null,
    birthday: params.birthday ?? null,
    isHost: params.isHost ?? false,
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
