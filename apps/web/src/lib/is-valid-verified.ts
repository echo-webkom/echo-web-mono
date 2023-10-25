const VALID_TIME = 1000 * 60 * 60 * 24 * 30 * 6; // 6, 30-day months

export function isValidVerified(date: Date | null) {
  if (!date) {
    return false;
  }
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff < VALID_TIME;
}
