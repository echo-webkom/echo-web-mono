import { getDate, getHours, getMonth, getWeek, isFriday, isMonday, isThursday } from "date-fns";

interface MessageItem {
  text: string;
  link?: string;
}

const baseMessages: Array<MessageItem> = [
  { text: "Bottom text" },
  { text: "🤙🤙🤙" },
  { text: "Lorem ipsum" },
  { text: "Uten sylteagurk!" },
  { text: "Spruuutnice" },
  { text: "Skambra!" },
  {
    text: "For ei skjønnas 😍",
    link: "https://echo.uib.no/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fpgq2pd26%2Fproduction%2Fb432aa79babd930dd1a492aee4d447318d04c8e4-2250x3000.png&w=1920&q=75",
  },
  { text: "Vim eller forsvinn" },
  { text: "Mye å gjøre? SUCK IT UP!" },
  { text: "@echo_webkom", link: "https://www.instagram.com/echo_webkom/" },
  { text: "@echo_uib", link: "https://www.instagram.com/echo_uib/" },
  { text: "JAJ FOR FAJ" },
  { text: "Dubkom", link: "https://echo-webkom.no" },
  { text: "1337" },
  { text: ":(){ :|:& };:", link: "https://askubuntu.com/questions/777562/what-does-do" },
  { text: "go func() { urself }()" },
  { text: "418 i'm a teapot" },
  { text: "New backend, who dis?", link: "https://localhost:8000" },
  { text: "Bedpresolini", link: "https://echo.uib.no/for-studenter/arrangementer?type=bedpres" },
  { text: "Divine intellect" },
  { text: "Skrevet i Holy C" },
  { text: "We stan Bjarne", link: "https://www.stroustrup.com/" },
  { text: "Rust or bust", link: "https://echo.uib.no/for-studenter/gruppe/echo-rust" },
  { text: "CRUD-kriger" },
  { text: "Liten e!!!", link: "/liten-e" },
  { text: "⭐️⭐️⭐️", link: "https://github.com/echo-webkom/echo-web-mono" },
  { text: "Vibe-coder litt bare" },
  { text: "0xDEADBEEF" },
  { text: "0xCAFEBABE" },
  { text: "Fist of Gnist", link: "https://echo.uib.no/for-studenter/gruppe/gnist" },
  { text: "Foobar" },
  { text: "Progbar > Ad fontes", link: "https://programmer.bar" },
  { text: "Progbar > Integrerbar", link: "https://programmer.bar" },
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
