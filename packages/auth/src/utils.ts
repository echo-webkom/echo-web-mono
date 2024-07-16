export const isFuture = (date: Date | number | string | undefined): boolean => {
  if (!date) {
    return false;
  }

  return new Date(date).getTime() > Date.now();
};
