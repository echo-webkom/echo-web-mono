import { getDate, getHours, getMonth, getWeek, isFriday, isMonday, isThursday } from "date-fns";

const baseMessages = [
  "Bottom text",
  "🤙🤙🤙",
  "Lorem ipsum",
  "Uten sylteagurk!",
  "Spruuutnice",
  "Skambra!",
  "For ei skjønnas 😍",
  "Vim eller forsvinn",
  "Mye å gjøre? SUCK IT UP!",
  "@echo_webkom",
  "@echo_uib",
  "JAJ FOR FAJ",
  "Dubkom",
  "1337",
  ":(){ :|:& };:",
];

function getCurrentRandomMessages(now: Date) {
  // Month-based messages
  if (getMonth(now) === 9) return [...baseMessages, "BØ!", "UuUuuUuuUuUu"];
  if (getMonth(now) === 11) return [...baseMessages, "Ho, ho, ho!"];

  const currentWeek = getWeek(now);
  if (currentWeek === 34 || currentWeek === 35)
    return [...baseMessages, "Velkommen (tilbake)!", "New semester, new me?"];

  // Day-based messages
  if (isThursday(now)) return [...baseMessages, "Vaffeltorsdag 🧇"];
  if (isFriday(now)) return [...baseMessages, "Tacofredag 🌯"];

  return baseMessages;
}

export function getRandomMessage() {
  const now = new Date();

  if (getMonth(now) === 4 && getDate(now) === 17) {
    return "Gralla 🇳🇴";
  } else if ([5, 6].includes(getMonth(now))) {
    return "God sommer 🌞";
  } else if (isThursday(now) && getHours(now) < 12) {
    return "Husk bedpres kl. 12:00!";
  } else if (getMonth(now) === 11 && getDate(now) >= 24) {
    return "God jul! 🎅";
  } else if (getMonth(now) === 0 && getDate(now) === 1) {
    return "Godt nyttår! ✨";
  } else if (isMonday(now)) {
    return "New week, new me?";
  }

  const messages = getCurrentRandomMessages(now);
  return messages[Math.floor(Math.random() * messages.length)];
}
