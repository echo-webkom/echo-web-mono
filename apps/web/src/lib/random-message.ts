import { getDate, getHours, getMonth, getWeek, isFriday, isMonday, isThursday } from "date-fns";

interface MessageItem {
  text: string;
  link?: string;
  when?: (date: Date) => boolean;
}

export const baseMessages: Array<MessageItem> = [
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
  { text: "418 I'm a teapot" },
  { text: "New backend, who dis?", link: "https://localhost:8000" },
  { text: "Bedpresolini", link: "https://echo.uib.no/for-studenter/arrangementer?type=bedpres" },
  { text: "Divine intellect" },
  { text: "Skrevet i Holy C" },
  { text: "We stan Bjarne", link: "https://www.stroustrup.com/" },
  { text: "Rust or bust", link: "https://echo.uib.no/for-studenter/gruppe/echo-rust" },
  { text: "CRUD-kriger" },
  { text: "Liten e!!!", link: "/liten-e" },
  { text: "⭐️⭐️⭐️", link: "https://github.com/echo-webkom/echo-web-mono" },
  { text: "Vibe-coder litt bare", link: "https://chatgpt.com/" },
  { text: "0xDEADBEEF" },
  { text: "0xCAFEBABE" },
  { text: "Fist of Gnist", link: "https://echo.uib.no/for-studenter/gruppe/gnist" },
  { text: "Foobar" },
  { text: "Progbar > Ad fontes", link: "https://programmer.bar" },
  { text: "Progbar > Integrerbar", link: "https://programmer.bar" },
  { text: "Tidlig eksamen", link: "/tidlig-eksamen" },
  { text: "Mac-en i taket😍", link: "/mac-en-i-taket" },
  {
    text: "Finding Steinar trees",
    link: "https://www.mimuw.edu.pl/~malcin/book/parameterized-algorithms.pdf#subsection.7.3.3",
  },
  { text: "Any polynomial is a good polynomial" },
  { text: "MEME101", link: "https://www4.uib.no/studier/emner/meme101" },
  { text: "Lean, mean, fighting machine", link: "https://lean-lang.org/" },
  { text: "Prove it!", link: "https://wiki.portal.chalmers.se/agda/pmwiki.php" },
  { text: "Vaffeltorsdag 🧇", when: (date) => isThursday(date) },
  { text: "Tacofredag 🌯", when: (date) => isFriday(date) },
  { text: "New semester, new me?", when: (date) => [34, 35].includes(getWeek(date)) },
  { text: "BØ! UuUuuUuuUuUu", when: (date) => getMonth(date) === 9 }, // October
  { text: "Ho, ho, ho!", when: (date) => getMonth(date) === 11 }, // December
  { text: "Gralla 🇳🇴", when: (date) => getMonth(date) === 4 && getDate(date) === 17 }, // May 17
  { text: "God sommer 🌞", when: (date) => [5, 6].includes(getMonth(date)) }, // June and July
  {
    text: "🥰💕💞💓💏💗💖💘💝",
    when: (date) => getMonth(date) === 1 && getDate(date) === 14,
  }, // Valentine's Day
  {
    text: "Husk bedpres kl. 12:00!",
    when: (date) => isThursday(date) && getHours(date) < 12,
  },
  { text: "God jul! 🎅", when: (date) => getMonth(date) === 11 && getDate(date) >= 24 }, // Christmas
  { text: "Godt nyttår! ✨", when: (date) => getMonth(date) === 0 && getDate(date) === 1 }, // New Year's Day
  { text: "New week, new me?", when: (date) => isMonday(date) },
  { text: "JavaScript™", link: "https://javascript.tm" },
  { text: "Norge skal til VM 🇳🇴" },
  { text: "Natürlich" },
];

export const getRandomMessage = (): MessageItem => {
  const today = new Date();

  // First, check for date-specific messages (higher priority)
  const dateSpecificMessages = baseMessages.filter((message) => {
    if (!message.when) return false;

    // Check if this is a date-specific message (uses getDate and getMonth)
    const whenString = message.when.toString();
    return whenString.includes("getDate") && whenString.includes("getMonth") && message.when(today);
  });

  if (dateSpecificMessages.length > 0) {
    const randomIndex = Math.floor(Math.random() * dateSpecificMessages.length);
    return dateSpecificMessages[randomIndex] ?? { text: "No message available" };
  }

  // If no date-specific messages, fall back to all applicable messages
  const filteredMessages = baseMessages.filter((message) => {
    return !message.when || message.when(today);
  });

  const randomIndex = Math.floor(Math.random() * filteredMessages.length);
  return filteredMessages[randomIndex] ?? { text: "No message available" };
};

export const getAllMessages = (): Array<MessageItem> => {
  return baseMessages.map((message) => ({
    text: message.text,
    link: message.link,
  }));
};
