import { type Registration, type SpotRange, type User } from "@echo-webkom/db/schemas";

export type UserWithIsHost = User & { isHost: boolean };

export type RegistrationWithUser = Registration & {
  user: UserWithIsHost | null;
};
type Registrations = Array<RegistrationWithUser>;

export function isAvailableSpot(
  spotRanges: Array<SpotRange>,
  registrations: Registrations,
  user: User,
  canSkip: boolean,
): boolean {
  //registrations is sorted by changedAt time
  //config contains no non-subset spotrange overlaps

  const waitlisted = registrations.filter((registration) => registration.status === "waiting");

  // If anyone is waitlisted for any given spotrange, this spotrange isn't relevant
  const relevantSpotRanges = spotRanges.filter((spotRange) => {
    return !waitlisted.some((wl) => {
      if (wl.user === null) {
        console.error("registration should always have user");
        throw new Error("registration should always have user");
      }
      return fitsInSpotrange(wl.user, spotRange) || wl.user.isHost;
    });
  });

  if (relevantSpotRanges.length === 0) {
    return false;
  }

  const sortedSpotRanges = relevantSpotRanges.sort((a, b) => {
    const aSize = a.maxYear - a.minYear;
    const bSize = b.maxYear - b.minYear;
    return aSize - bSize;
  });

  const spotsLeft = sortedSpotRanges.map(({ spots }) => spots);

  registrations.forEach((registration) => {
    if (registration.user === null) {
      console.error("registration should always have user");
      throw new Error("registration should always have user");
    }

    for (let i = 0; i < sortedSpotRanges.length; i++) {
      const spotrange = sortedSpotRanges[i];
      if (
        (fitsInSpotrange(registration.user, spotrange) || registration.user.isHost) &&
        spotsLeft[i] > 0
      ) {
        spotsLeft[i]--;
        break;
      }
    }
  });

  return sortedSpotRanges.some((spotRange, index) => {
    if (fitsInSpotrange(user, spotRange) || canSkip) {
      return spotsLeft[index] > 0 || spotRange.spots === 0;
    }
  });
}

export function fitsInSpotrange(user: User, spotRange: SpotRange): boolean {
  if (user.year === null) {
    return false;
  }

  return user.year >= spotRange.minYear && user.year <= spotRange.maxYear;
}
