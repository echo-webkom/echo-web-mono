import { getHappeningsFromDateToDate, getStrike, type DBHappening, type DBUser } from "./queries";

export const BAN_LENGTH = 3;

export const isUserBanned = async (user: DBUser, bedpres: DBHappening) => {
  if (bedpres.type !== "bedpres") {
    return false;
  }

  if (!bedpres.date) {
    return false;
  }

  if (!user.year) {
    return false;
  }

  if (!user.bannedFromStrike || !user.isBanned) {
    return false;
  }

  const strike = await getStrike(user.bannedFromStrike);
  const dateBanned = strike?.strikeInfo.createdAt;
  if (!dateBanned) {
    return false;
  }

  const happenings = await getHappeningsFromDateToDate(dateBanned, bedpres.date);

  const available = happenings
    .filter((happening) =>
      happening.spotRanges.some(
        (spotRange) => user.year! >= spotRange.minYear && user.year! <= spotRange.maxYear,
      ),
    )
    .filter((happening) => happening.type === "bedpres");

  return available.length < BAN_LENGTH;
};
