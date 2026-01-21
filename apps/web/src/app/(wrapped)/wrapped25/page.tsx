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
import {
  BEER,
  BEST_COMMENT,
  COFFEE,
  COMMENTS,
  EVENTS_PER_GROUP,
  JOBS,
  NEW_USERS,
  POSTS,
  REACTIONS,
  REGISTRATIONS,
  REPLIES,
  RU_MONEY,
  TOP_10_EVENTS,
  TOTAL_USERS,
} from "./stats";

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

function Registrations() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={[`Registreringer 2025`, `Se hvor mange som registrerte seg!`]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          {" "}
          <CountUp
            from={0}
            to={REGISTRATIONS}
            separator=","
            direction="up"
            duration={0.2}
            className="text-5xl font-bold"
          />
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

function Beer() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Skål for echo 2026"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl">
          <p>Dette er så mange liter øl som ble solgt</p>
        </div>
        <div className="text-6xl font-medium text-white">
          <CountUp
            from={0}
            to={BEER}
            separator=","
            direction="up"
            duration={0.2}
            className="text-5xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function BestComment() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-green-500 via-teal-400 to-cyan-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Beste kommentarene i år!"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-center text-2xl font-medium text-white">
          {BEST_COMMENT.name} <span className="text-lg">({BEST_COMMENT.replies} replies)</span>
        </div>
      </div>
    </Slide>
  );
}

function Coffee() {
  return (
    <Slide>
      <div className="to-brown-500 flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-yellow-700 via-orange-600 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Dette er uheldigvis så mye penger vi brukte på kaffe gjennom 2025"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-4xl font-medium text-white">
          <CountUp
            from={0}
            to={COFFEE}
            separator=","
            suffix=" kr"
            direction="up"
            duration={0.2}
            className="text-4xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function Comments() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Antall kommentarer gjennom hele 2025"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-4xl font-medium text-white">
          {" "}
          <CountUp
            from={0}
            to={COMMENTS}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function Jobs() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Antall jobber lagt ut i 2025"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          {" "}
          <CountUp
            from={0}
            to={JOBS}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function Posts() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Antall innlegg gjennom 2025"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          <CountUp
            from={0}
            to={POSTS}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function Reactions() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Antall reaksjoner på arrangement i 2024"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          {" "}
          <CountUp
            from={0}
            to={REACTIONS}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function Replies() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Antall svar på kommentarer"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          {" "}
          <CountUp
            from={0}
            to={REPLIES}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function RuMoney() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Dette er hvor mye penger vi har fått fra RU"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          <CountUp
            from={0}
            to={RU_MONEY}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}
function NewUsers() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-green-400 via-lime-400 to-yellow-400 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Nye brukere 2025", "Velkommen til alle nye medlemmer!"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          <CountUp
            from={0}
            to={NEW_USERS}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}

function TotalUsers() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-teal-400 via-green-400 to-lime-400 p-8">
        <TextType
          className="text-5xl font-extrabold text-white drop-shadow-lg"
          text={["Totalt antall brukere", "Se hvor mange som er med inn i 2026"]}
          typingSpeed={100}
          pauseDuration={1500}
          showCursor={true}
        />
        <div className="text-2xl font-medium text-white">
          <CountUp
            from={0}
            to={TOTAL_USERS}
            separator=","
            direction="up"
            duration={0.2}
            className="text-3xl font-bold"
          />
        </div>
      </div>
    </Slide>
  );
}
export default function Wrapped() {
  return (
    <Scroller
      slides={[
        <Velkommen />,
        <Welcome />,
        <Registrations />,
        <TopEventsStack />,
        <EventsPerGroup />,
        <Beer />,
        <BestComment />,
        <Coffee />,
        <Comments />,
        <Jobs />,
        <Posts />,
        <Reactions />,
        <Replies />,
        <RuMoney />,
        <NewUsers />,
        <TotalUsers />,
      ]}
    />
  );
}
