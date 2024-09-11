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
];

const getExtraMessages = (now: Date): Array<MessageItem> => {
  const week = getWeek(now);
  const month = getMonth(now);

  const messages: Array<MessageItem> = [];

  if (isThursday(now)) {
    messages.push({ text: "Vaffeltorsdag 🧇" });
  }

  if (isFriday(now)) {
    messages.push({ text: "Tacofredag 🌯" });
  }

  if (week === 34 || week === 35) {
    messages.push({ text: "Velkommen (tilbake)!" }, { text: "New semester, new me?" });
  }

  // October
  if (month === 9) {
    messages.push({ text: "BØ!" }, { text: "UuUuuUuuUuUu" });
  }

  // December
  if (month === 11) {
    messages.push({ text: "Ho, ho, ho!" });
  }

  return messages;
};

const getDateSpecificMessage = (date: Date): MessageItem | null => {
  if (getMonth(date) === 4 && getDate(date) === 17) {
    return { text: "Gralla 🇳🇴" };
  }

  if ([5, 6].includes(getMonth(date))) {
    return { text: "God sommer 🌞" };
  }

  if (getMonth(date) === 1 && getDate(date) === 14) {
    return { text: "🥰💕💞💓💏💗💖💘💝" };
  }

  if (isThursday(date) && getHours(date) < 12) {
    return { text: "Husk bedpres kl. 12:00!" };
  }

  if (getMonth(date) === 11 && getDate(date) >= 24) {
    return { text: "God jul! 🎅" };
  }

  if (getMonth(date) === 0 && getDate(date) === 1) {
    return { text: "Godt nyttår! ✨" };
  }

  if (isMonday(date)) {
    return { text: "New week, new me?" };
  }

  return null;
};

export const getRandomMessage = (): MessageItem => {
  const now = new Date();

  const dateSpecificMessage = getDateSpecificMessage(now);
  if (dateSpecificMessage) {
    return dateSpecificMessage;
  }

  const messages = [...baseMessages, ...getExtraMessages(now)];
  return messages[Math.floor(Math.random() * messages.length)] ?? { text: "404", link: "/404" };
};
