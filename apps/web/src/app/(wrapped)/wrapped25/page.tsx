"use client";

import Image from "next/image";

import Background1 from "./assets/NeoMemphis1.png";
import Background2 from "./assets/NeoMemphis2.jpg";
import AnimatedContent from "./components/AnimatedContent";
import CountUp from "./components/CountUp";
import GradientText from "./components/GradientText";
import ScrollStack from "./components/ScrollStack";
import ShinyText from "./components/ShinyText";
import TextType from "./components/TextType";
import Scroller from "./Scroller";
import { Slide } from "./Slide";
import { REGISTRATIONS, TOP_10_EVENTS } from "./stats";

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
        <div className="-mt-15 relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-6 p-8 text-white">
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

function TopEvents() {
  return (
    <Slide>
      <div className="relative min-h-screen w-screen">
        <Image
          src={Background1}
          alt="bakgrunn"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="-mt-15 relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-6 p-8 text-white">
          <AnimatedContent direction="vertical" distance={40} delay={0.2} duration={1.2}>
            <p className="bg-red-300 text-center text-2xl font-semibold md:text-4xl">
              Dette var de mest påmeldte arrangementene:
            </p>
            <ul className="flex flex-col items-center gap-3 text-xl">
              {TOP_10_EVENTS.map((event, index) => (
                <li
                  key={index}
                  className="w-fit rounded-xl bg-white/20 px-6 py-3 shadow-md backdrop-blur-md transition hover:bg-white/30"
                >
                  <span className="font-bold">{index + 1}.</span> {event.name}
                  <span className="ml-2 text-sm opacity-80">({event.registrations} påmeldte)</span>
                </li>
              ))}
            </ul>
          </AnimatedContent>
        </div>
      </div>
    </Slide>
  );
}

function TopEventsStack() {
  return (
    <Slide>
      <ScrollStack>
        <ScrollStackItem>
          <h2>Card 1</h2>
          <p>This is the first card in the stack</p>
        </ScrollStackItem>
        <ScrollStackItem>
          <h2>Card 2</h2>
          <p>This is the second card in the stack</p>
        </ScrollStackItem>
        <ScrollStackItem>
          <h2>Card 3</h2>
          <p>This is the third card in the stack</p>
        </ScrollStackItem>
      </ScrollStack>
    </Slide>
  );
}

export default function Wrapped() {
  return (
    <>
      <Scroller slides={[<Velkommen />, <Welcome />, <Events />, <TopEvents />]}></Scroller>
    </>
  );
}
