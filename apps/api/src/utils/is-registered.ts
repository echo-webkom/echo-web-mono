import { Registration, SpotRange, User } from "@echo-webkom/db/schemas";

export type RegistrationWithUser = {
  registration: Registration;
  user: User;
};

type Registrations = Array<RegistrationWithUser>;

export function canRegister(
  spotRanges: Array<SpotRange>,
  registrations: Registrations,
  user: User,
): boolean {
  //registrations is sorted by changedat time
  //config contains no non-subset overlaps

  const sortedSpotRanges = spotRanges.sort((a, b) => {
    const aSize = a.maxYear - a.minYear;
    const bSize = b.maxYear - b.minYear;
    return aSize - bSize;
  });

  const counts = sortedSpotRanges.map(({ spots }) => spots);

  registrations.forEach((registration) => {
    for (let i = 0; i < sortedSpotRanges.length; i++) {
      const spotrange = sortedSpotRanges[i];
      if (isLegalSpotrange(registration.user, spotrange) && counts[i] > 0) {
        counts[i]--;
        break;
      }
    }
  });

  return sortedSpotRanges.some((spotRange, index) => {
    return isLegalSpotrange(user, spotRange) && counts[index] > 0;
  });
}

function isLegalSpotrange(user: User, spotRange: SpotRange): boolean {
  if (user.year === null) {
    return false;
  }

  return user.year >= spotRange.minYear && user.year <= spotRange.maxYear;
}
