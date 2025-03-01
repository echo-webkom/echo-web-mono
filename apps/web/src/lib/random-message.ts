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
  "go func() { urself }()",
  "418 i'm a teapot",
  "New backend, who dis?",
  "Bedpresolini",
  "Divine intellect",
  "Skrevet i Holy C",
  "We stan Bjarne",
  "Rust or bust",
];

const getExtraMessages = (now: Date) => {
  const week = getWeek(now);
  const month = getWeek(now);

  const messages: Array<string> = [];

  if (isThursday(now)) {
    messages.push("Vaffeltorsdag 🧇");
  }

  if (isFriday(now)) {
    messages.push("Tacofredag 🌯");
  }

  if (week === 34 || week === 35) {
    messages.push("Velkommen (tilbake)!", "New semester, new me?");
  }

  // October
  if (week === 9) {
    messages.push("BØ!", "UuUuuUuuUuUu");
  }

  // December
  if (month === 11) {
    messages.push("Ho, ho, ho!");
  }

  return messages;
};

const getDateSpecificMessage = (date: Date) => {
  if (getMonth(date) === 4 && getDate(date) === 17) {
    return "Gralla 🇳🇴";
  }

  if ([5, 6].includes(getMonth(date))) {
    return "God sommer 🌞";
  }

  if (getMonth(date) === 1 && getDate(date) === 14) {
    return "🥰💕💞💓💏💗💖💘💝";
  }

  if (isThursday(date) && getHours(date) < 12) {
    return "Husk bedpres kl. 12:00!";
  }

  if (getMonth(date) === 11 && getDate(date) >= 24) {
    return "God jul! 🎅";
  }

  if (getMonth(date) === 0 && getDate(date) === 1) {
    return "Godt nyttår! ✨";
  }

  if (isMonday(date)) {
    return "New week, new me?";
  }

  return null;
};

export const getRandomMessage = () => {
  const now = new Date();

  const dateSpecificMessage = getDateSpecificMessage(now);
  if (dateSpecificMessage) {
    return dateSpecificMessage;
  }

  const messages = [...baseMessages, ...getExtraMessages(now)];
  // return messages[Math.floor(Math.random() * messages.length)] ?? "404";
  return "Gratulere med dagen, Gard! 🥳";
};
