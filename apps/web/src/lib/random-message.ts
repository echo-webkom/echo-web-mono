import { getDate, getHours, getMonth, getWeek, isFriday, isMonday, isThursday } from "date-fns";

// Define interface for message items
interface MessageItem {
  text: string;
  link?: string; // Optional link
}

// Convert all messages to message objects
const baseMessages: Array<MessageItem> = [
  { text: "Bottom text" },
  { text: "🤙🤙🤙" },
  { text: "Lorem ipsum" },
  { text: "Uten sylteagurk!" },
  { text: "Spruuutnice" },
  { text: "Skambra!" },
  { text: "For ei skjønnas 😍" },
  { text: "Vim eller forsvinn" },
  { text: "Mye å gjøre? SUCK IT UP!" },
  { text: "@echo_webkom" },
  { text: "@echo_uib" },
  { text: "JAJ FOR FAJ" },
  { text: "Dubkom" },
  { text: "1337" },
  { text: ":(){ :|:& };:" },
  { text: "go func() { urself }()" },
  { text: "418 i'm a teapot" },
  { text: "New backend, who dis?" },
  { text: "Bedpresolini" },
  { text: "Divine intellect" },
  { text: "Skrevet i Holy C" },
  { text: "We stan Bjarne" },
  { text: "Rust or bust" },
  { text: "CRUD-kriger" },
  { text: "liten-e", link: "/liten-e" },
];

const getExtraMessages = (now: Date): Array<MessageItem> => {
  const week = getWeek(now);
  const month = getMonth(now);

  const messages: Array<MessageItem> = [];

  if (isThursday(now)) {
    messages.push({ text: "Vaffeltorsdag 🧇", link: "/arrangementer" });
  }

  if (isFriday(now)) {
    messages.push({ text: "Tacofredag 🌯" });
  }

  if (week === 34 || week === 35) {
    messages.push(
        { text: "Velkommen (tilbake)!", link: "/guide" },
        { text: "New semester, new me?" }
    );
  }

  // October
  if (month === 9) {
    messages.push(
        { text: "BØ!" },
        { text: "UuUuuUuuUuUu" }
    );
  }

  // December
  if (month === 11) {
    messages.push({ text: "Ho, ho, ho!", link: "/julekalender" });
  }

  return messages;
};

const getDateSpecificMessage = (date: Date): MessageItem | null => {
  if (getMonth(date) === 4 && getDate(date) === 17) {
    return { text: "Gralla 🇳🇴", link: "/17mai" };
  }

  if ([5, 6].includes(getMonth(date))) {
    return { text: "God sommer 🌞" };
  }

  if (getMonth(date) === 1 && getDate(date) === 14) {
    return { text: "🥰💕💞💓💏💗💖💘💝", link: "/valentine" };
  }

  if (isThursday(date) && getHours(date) < 12) {
    return { text: "Husk bedpres kl. 12:00!", link: "/bedpres" };
  }

  if (getMonth(date) === 11 && getDate(date) >= 24) {
    return { text: "God jul! 🎅", link: "/julekalender" };
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
