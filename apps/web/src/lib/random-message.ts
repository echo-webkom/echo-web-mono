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
];

function getExtraMessages(now: Date) {
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
}

export function getRandomMessage() {
  const now = new Date();

  /**
   * Special messages for specific dates.
   */
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

  const messages = [...baseMessages, ...getExtraMessages(now)];
  return messages[Math.floor(Math.random() * messages.length)];
}

export class RandomMessageSingleton {
  private static instance: RandomMessageSingleton;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): RandomMessageSingleton {
    if (!RandomMessageSingleton.instance) {
      RandomMessageSingleton.instance = new RandomMessageSingleton();
    }

    return RandomMessageSingleton.instance;
  }

  public getRandomMessage() {
    return getRandomMessage();
  }
}
