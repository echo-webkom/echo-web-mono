"use client";

import { useEffect } from "react";
import Image from "next/image";

import Background1 from "./assets/NeoMemphis1.png";
import Background2 from "./assets/NeoMemphis2.jpg";
import AnimatedContent from "./components/AnimatedContent";
import CountUp from "./components/CountUp";
import CurvedLoop from "./components/CurvedLoop";
import GradientText from "./components/GradientText";
import ScrollStack, { ScrollStackItem } from "./components/ScrollStack";
import ShinyText from "./components/ShinyText";
import TextType from "./components/TextType";
import Scroller from "./Scroller";
import { Slide } from "./Slide";
import { EVENTS_PER_GROUP, REGISTRATIONS, TOP_10_EVENTS } from "./stats";

function Velkommen({ goToNext }) {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 p-8 text-white">
        <GradientText
          text="echo wrapped 2025"
          gradientFrom="#ff0050"
          gradientTo="#00f2ea"
          className="text-6xl font-extrabold drop-shadow-lg"
        />
        <TextType
          className="text-2xl font-medium"
          text={["Velkommen tilbake!", "La oss se hva du har gjort i år 🎧"]}
          typingSpeed={80}
          pauseDuration={1200}
          showCursor={true}
        />
        <button onClick={goToNext} className="px-8 py-3 text-lg font-semibold">
          Start
        </button>
      </div>
    </Slide>
  );
}

function Welcome() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-purple-600 via-indigo-500 to-pink-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Endelig echo wrapped 2025", "Velkommen til echo wrapped 2025"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </div>
    </Slide>
  );
}

function Events() {
  return (
    <Slide>
      <div className="relative min-h-screen w-full">
        <Image
          src={Background2}
          alt="bakgrunn"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-10 -mt-15 flex min-h-screen w-full flex-col items-center justify-center gap-6 p-8 text-white">
          <AnimatedContent direction="vertical" distance={40} delay={0.2} duration={1.2}>
            <p className="bg-red-300 text-center text-2xl font-semibold md:text-4xl">
              Det var vilt mange påmeldinger totalt i år
              <br />
              det var hele:
            </p>
          </AnimatedContent>
          <AnimatedContent direction="vertical" distance={40} delay={0.1} duration={0.5}>
            <CountUp
              from={0}
              to={REGISTRATIONS}
              separator=","
              direction="up"
              duration={0.2}
              className="bg-red-300 text-5xl font-bold"
            />
          </AnimatedContent>
          <AnimatedContent direction="vertical" distance={40} delay={0.5} duration={1.2}>
            <p className="bg-red-300 text-center text-2xl font-semibold md:text-4xl">
              påmeldinger i år!!
            </p>
          </AnimatedContent>
        </div>
      </div>
    </Slide>
  );
}

function TopEventsStack({ goToNext }) {
  const COLORS = [
    "bg-indigo-600",
    "bg-pink-600",
    "bg-green-600",
    "bg-red-600",
    "bg-purple-600",
    "bg-blue-600",
    "bg-yellow-600",
    "bg-teal-600",
    "bg-orange-600",
    "bg-rose-600",
  ];

  // Total tid for å vise alle events før vi går videre
  const totalDuration = TOP_10_EVENTS.length * 2000; // 2 sek per event, juster etter behov

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [goToNext]);

  return (
    <Slide>
      <ScrollStack>
        <CurvedLoop
          marqueeText="Top mest 10 påmeldte arrangementer. Sveip ned for"
          speed={5}
          curveAmount={-300}
          interactive={false}
        />
        {TOP_10_EVENTS.map((event, index) => (
          <ScrollStackItem key={index}>
            <div
              className={`rounded-xl p-6 text-white shadow-2xl md:p-10 ${COLORS[index % COLORS.length]}`}
            >
              <h3 className="mb-2 text-xl font-bold md:text-3xl">
                #{index + 1}: {event.name}
              </h3>
              <p className="text-lg opacity-90 md:text-xl">
                <span className="font-extrabold">{event.registrations}</span> påmeldinger
              </p>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </Slide>
  );
}

function EventsPerGroup() {
  return (
    <Slide>
      <div className="relative min-h-screen w-screen bg-red-900">
        <div className="relative z-10 -mt-15 flex min-h-screen w-full flex-col items-center justify-center gap-6 p-8 text-white">
          <AnimatedContent direction="vertical" distance={40} delay={0.2} duration={1.2}>
            <p className="text-center text-2xl font-semibold md:text-4xl">
              Antall arrangement per undergruppe:
              <br /> <br />
            </p>
            <ul className="flex flex-col items-center gap-3 text-xl">
              {EVENTS_PER_GROUP.map((event, index) => (
                <li
                  key={index}
                  className="w-fit rounded-xl bg-white/20 px-6 py-3 shadow-md backdrop-blur-md transition hover:bg-white/30"
                >
                  <span className="font-bold">{index + 1}.</span> {event.name}
                  <span className="ml-2 text-sm opacity-80">({event.events} arrangementer)</span>
                </li>
              ))}
            </ul>
          </AnimatedContent>
        </div>
      </div>
    </Slide>
  );
}

export default function Wrapped() {
  return (
    <Scroller
      slides={(goToNext) => [
        <Velkommen goToNext={goToNext} />,
        <Welcome />,
        <Events />,
        <TopEventsStack goToNext={goToNext} />,
        <EventsPerGroup />,
      ]}
    />
  );
}
