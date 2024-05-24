export const calculateTimeLeft = (date: Date) => {
  const now = new Date().getTime();
  const difference = date.getTime() - now;

  if (difference <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }

  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};
