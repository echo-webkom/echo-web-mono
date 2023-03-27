import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import {getDate, getHours, getMonth, getWeek, isFriday, isMonday, isThursday} from "date-fns";
import {nb} from "date-fns/locale";
import {motion} from "framer-motion";

const randomHeaderMessage = () => {
  const now = new Date();

  const stdMessages = () => {
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
    ];

    // Month-based messages
    if (getMonth(now) === 9) {
      return [...baseMessages, "BØ!", "UuUuuUuuUuUu"];
    }
    if (getMonth(now) === 11) {
      return [...baseMessages, "Ho, ho, ho!"];
    }

    // Week-based messages
    const currentWeek = getWeek(now, {locale: nb});
    if (currentWeek === 34 || currentWeek === 35) {
      return [...baseMessages, "Velkommen (tilbake)!", "New semester, new me?"];
    }

    // Day-based messages
    if (isThursday(now)) {
      return [...baseMessages, "Vaffeltorsdag 🧇"];
    }
    if (isFriday(now)) {
      return [...baseMessages, "Tacofredag 🌯"];
    }

    return baseMessages;
  };

  // Messages that override stdMessages
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

  return stdMessages()[Math.floor(Math.random() * stdMessages().length)];
};

type HeaderLogoProps = {
  className?: string;
  isShrunk: boolean;
};

const HeaderLogo = ({className, isShrunk}: HeaderLogoProps) => {
  const [_headerMessage, setHeaderMessage] = useState("");

  useEffect(() => {
    const message = randomHeaderMessage() ?? "";
    setHeaderMessage(message);

    return () => {
      setHeaderMessage("");
    };
  }, []);

  const logo = "/images/android-chrome-512x512.png";

  return (
    <div className={cn(className)}>
      <Link href="/" className="flex items-center gap-5">
        <motion.div
          style={{
            height: isShrunk ? 50 : 100,
            width: isShrunk ? 50 : 100,
          }}
          className="relative h-20 w-20 origin-right transition-all duration-300 ease-in-out md:h-24 md:w-24"
        >
          <Image src={logo} alt="logo" fill />
        </motion.div>
      </Link>
    </div>
  );
};

export default HeaderLogo;
