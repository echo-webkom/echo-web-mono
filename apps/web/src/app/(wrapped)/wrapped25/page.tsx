"use client";

import { useState } from "react";

import AnimatedContent from "./components/AnimatedContent";
import CountUp from "./components/CountUp";
import GradientText from "./components/GradientText";
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

const BackgroundBlob = ({ color, className }) => (
  <div
    className={`pointer-events-none absolute rounded-full opacity-30 blur-[100px] ${color} ${className}`}
  />
);

const NavigationFooter = ({ current, total }) => (
  <div className="pointer-events-none fixed bottom-0 left-0 z-50 flex w-full items-center justify-between p-6 mix-blend-difference">
    <span className="font-mono text-xs font-bold tracking-[0.3em] text-white uppercase">
      echo Wrapped // 2025
    </span>
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-200 ease-out ${
            i === current ? "w-8 bg-white opacity-100" : "w-1.5 bg-white opacity-40"
          }`}
        />
      ))}
    </div>
  </div>
);

function Velkommen({ goToNext }: { goToNext?: () => void }) {
  return (
    <Slide>
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black p-8 text-white">
        <BackgroundBlob color="bg-purple-600" className="-top-20 -left-20 h-96 w-96" />
        <BackgroundBlob color="bg-blue-600" className="right-0 bottom-0 h-[500px] w-[500px]" />

        <div className="z-10 flex flex-col items-center gap-4 md:gap-6">
          <p className="text-xs font-bold tracking-widest text-white/60 uppercase md:text-sm">
            ÅRETS OPPSUMMERING
          </p>
          <GradientText
            text="echo wrapped"
            gradientFrom="#d946ef"
            gradientTo="#8b5cf6"
            className="text-center text-6xl leading-[0.9] font-black tracking-tighter uppercase md:text-8xl"
          />
          <div className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-6xl font-black whitespace-nowrap text-transparent md:text-8xl">
            2025
          </div>

          <div className="mt-8 h-12">
            <TextType
              className="text-lg font-medium text-white/80 md:text-2xl"
              text={["Velkommen tilbake 👋", "Er du klar for tallene?"]}
              typingSpeed={75}
              pauseDuration={500}
              showCursor={true}
            />
          </div>

          <button
            onClick={goToNext}
            className="mt-8 rounded-full bg-white px-8 py-3 text-lg font-bold text-black transition hover:scale-105 hover:bg-gray-200 md:px-10 md:py-4 md:text-xl"
          >
            Start reisen
          </button>
        </div>
      </div>
    </Slide>
  );
}

function Welcome() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#1ed760] p-8 text-center text-black">
        <h1 className="text-6xl leading-tight font-black tracking-tighter md:text-8xl">
          Det har vært et <br />
          <span className="italic">hektisk</span> <br />
          år.
        </h1>
      </div>
    </Slide>
  );
}

const StatSlide = ({
  gradient,
  label,
  number,
  unit = "",
  subtext = "",
  unitColor = "text-white/80",
}) => (
  <Slide>
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black p-8`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-40 ${gradient}`} />

      <div className="z-10 flex w-full flex-col items-center text-center">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
          Visste du at?
        </p>

        <div className="mb-6 flex h-12 items-center">
          <ShinyText text={label} speed={3} className="text-xl font-bold text-white md:text-3xl" />
        </div>

        <div className="flex w-full flex-col items-center transition-transform duration-700 hover:scale-105">
          <CountUp
            from={0}
            to={number}
            separator=" "
            duration={2}
            className="text-[12vh] leading-none font-black tracking-tighter whitespace-nowrap text-white drop-shadow-2xl md:text-[18vh]"
          />
          {unit && (
            <span
              className={`mt-2 text-3xl font-black tracking-widest uppercase md:text-5xl ${unitColor}`}
            >
              {unit}
            </span>
          )}
        </div>

        {subtext && (
          <p className="mt-8 max-w-xs text-lg font-medium text-white/70 italic md:max-w-md md:text-xl">
            "{subtext}"
          </p>
        )}
      </div>
    </div>
  </Slide>
);

function Registrations() {
  const registrationsPerDay = (REGISTRATIONS / 200).toFixed(1);
  return (
    <StatSlide
      gradient="from-blue-600 to-indigo-900"
      label="Antall påmeldinger på arrangement i 2025"
      number={REGISTRATIONS}
      subtext={`Det tilsvarer ca. ${registrationsPerDay} påmeldinger per skoledag!`}
    />
  );
}

function TopEventsStack() {
  const COLORS = [
    "text-[#ff0050]",
    "text-[#00f2ea]",
    "text-[#4ade80]",
    "text-[#facc15]",
    "text-[#a855f7]",
  ];
  return (
    <Slide>
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-black p-6 text-white md:p-12">
        <BackgroundBlob color="bg-purple-900" className="-top-20 -right-20 h-96 w-96 opacity-20" />
        <div className="z-10 mt-4 mb-8">
          <p className="mb-2 text-sm font-bold tracking-[0.3em] text-[#1ed760] uppercase">
            Topplisten
          </p>
          <h2 className="text-5xl leading-none font-black tracking-tighter uppercase md:text-7xl">
            Mest populære <br /> <span className="text-gray-500">arrangementer</span>
          </h2>
        </div>
        <div className="z-10 flex flex-grow flex-col justify-center gap-2 md:gap-4">
          {TOP_10_EVENTS.slice(0, 5).map((event, index) => (
            <AnimatedContent
              key={index}
              direction="horizontal"
              distance={100}
              delay={0.2 + index * 0.1}
              duration={0.8}
            >
              <div className="group flex items-center gap-4 border-b border-white/10 py-2 transition-colors duration-300 hover:bg-white/5 md:gap-6">
                <span
                  className={`min-w-[60px] text-4xl font-black italic md:min-w-[90px] md:text-6xl ${COLORS[index % COLORS.length]}`}
                >
                  {index + 1}
                </span>
                <div className="flex flex-col">
                  <h3 className="max-w-[200px] truncate text-xl font-bold uppercase md:max-w-md md:text-3xl">
                    {event.name}
                  </h3>
                  <p className="font-mono text-sm text-gray-400 md:text-lg">
                    <span className="font-bold text-white">{event.registrations}</span> påmeldinger
                  </p>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </Slide>
  );
}

function EventsPerGroup() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-[#121212] p-8 pt-16 text-white">
        <h2 className="mb-12 text-center text-4xl font-black text-[#1ed760] uppercase">
          Hvem arrangerte mest?
        </h2>
        <div className="mb-20 flex w-full max-w-2xl flex-col gap-4">
          {EVENTS_PER_GROUP.map((event, index) => (
            <div key={index} className="group flex items-center gap-4">
              <span className="w-8 font-mono text-xl text-gray-500">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-2xl font-bold transition-colors group-hover:text-[#1ed760]">
                    {event.name}
                  </span>
                  <span className="font-mono text-xl text-gray-400">{event.events}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full bg-white transition-all duration-1000 ease-out group-hover:bg-[#1ed760]"
                    style={{ width: `${(event.events / EVENTS_PER_GROUP[0].events) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

function Beer() {
  return (
    <StatSlide
      gradient="from-[#f59e0b] via-[#b45309] to-[#451a03]"
      label="Liter øl solgt 🍺"
      number={BEER}
      unit="LITER"
      unitColor="text-[#fef3c7]"
      subtext="Skål for 2026!"
    />
  );
}

function BestComment() {
  return (
    <Slide>
      <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#1c1c1c] p-10">
        <div className="z-10 flex max-w-4xl flex-col items-center text-center">
          <p className="mb-14 text-[10px] font-bold tracking-[0.7em] text-white/30 uppercase">
            Ufiltrert fra diskusjonen
          </p>

          <div className="relative px-8">
            <span className="absolute -top-16 -left-2 font-serif text-[100px] text-white/5 italic">
              “
            </span>

            <h2 className="relative z-10 text-3xl leading-[1.4] font-light tracking-tight text-white/85 italic md:text-5xl lg:text-6xl">
              {BEST_COMMENT.name}
            </h2>

            <span className="absolute -right-2 -bottom-24 font-serif text-[100px] text-white/5 italic">
              ”
            </span>
          </div>

          <div className="mt-20 flex items-center gap-6">
            <div className="h-[1px] w-6 bg-white/10" />
            <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">
              {BEST_COMMENT.replies} folk hadde mye på hjertet
            </p>
            <div className="h-[1px] w-6 bg-white/10" />
          </div>
        </div>
      </div>
    </Slide>
  );
}

function Coffee() {
  const [done, setDone] = useState(false);
  return (
    <Slide>
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#3f2e26] p-8 text-[#f5d0a9]">
        <div className="relative z-10 flex w-full flex-col items-center text-center">
          <TextType
            className={`text-xl font-bold tracking-widest uppercase transition-opacity duration-700 md:text-2xl ${done ? "opacity-50" : "opacity-100"}`}
            text={["Kaffebudsjettet..."]}
            typingSpeed={50}
            pauseDuration={1000}
            showCursor={false}
          />
          <div className="mt-8 flex w-full flex-col items-center justify-center">
            <CountUp
              from={0}
              to={COFFEE}
              separator=" "
              duration={2}
              onEnd={() => setDone(true)}
              className="text-[14vh] leading-none font-black tracking-tighter whitespace-nowrap text-[#d4a574] drop-shadow-lg md:text-[20vh]"
            />
            <span className="mt-2 text-4xl font-bold tracking-widest uppercase md:mt-4 md:text-5xl">
              kopper
            </span>
          </div>
        </div>
      </div>
    </Slide>
  );
}

function Comments() {
  return (
    <StatSlide
      gradient="from-[#6366f1] via-[#a855f7] to-[#4c1d95]"
      label="Hele"
      number={COMMENTS}
      unit="kommentarer"
      unitColor="text-indigo-200"
      subtext="Et levende kommentarfelt året rundt."
    />
  );
}

function Jobs() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col justify-between bg-white p-8 text-black md:p-16">
        <div className="w-full border-b-4 border-black pb-4 text-lg font-bold tracking-widest uppercase md:text-xl">
          Karriere
        </div>
        <div className="flex w-full flex-col items-center overflow-hidden">
          <CountUp
            from={0}
            to={JOBS}
            separator=""
            className="text-[20vh] leading-none font-black tracking-tighter whitespace-nowrap md:text-[22vh]"
          />
          <h2 className="bg-black px-4 py-1 text-center text-3xl font-bold text-white uppercase md:text-6xl">
            Nye Jobber
          </h2>
        </div>
        <div className="flex w-full justify-between font-mono text-xs text-gray-500">
          <span>ECHO</span>
          <span>2025</span>
        </div>
      </div>
    </Slide>
  );
}

function Posts() {
  return (
    <StatSlide
      gradient="from-[#3b82f6] via-[#1e40af] to-[#0f172a]"
      label="Innhold som engasjerte"
      number={POSTS}
      unit="PUBLISERTE INNLEGG"
      unitColor="text-blue-200/50"
      subtext="Takk til alle som holder liv i feeden!"
    />
  );
}
function Reactions() {
  return (
    <StatSlide
      gradient="from-[#d946ef] via-[#9333ea] to-[#2e1065]"
      label="Folk reagerer"
      number={REACTIONS}
      unit="REAKSJONER"
      unitColor="text-fuchsia-200/70"
      subtext="👍 🔥 ❤️"
    />
  );
}

function Replies() {
  return (
    <StatSlide
      gradient="from-cyan-500 via-blue-600 to-indigo-800"
      label="Antall svar på kommentarer"
      number={REPLIES}
      unit="SVAR"
      unitColor="text-cyan-200/60"
      subtext="Ingen spørsmål forble ubesvart, og ingen diskusjon var for liten."
    />
  );
}

// function RuMoney() {
//   return (
//     <Slide>
//       <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black p-8 text-white">
//         <BackgroundBlob color="bg-green-500" className="-top-20 -right-20 h-96 w-96 opacity-40" />
//         <BackgroundBlob color="bg-emerald-800" className="bottom-0 left-0 h-80 w-80 opacity-30" />

//         <div className="z-10 text-center">
//           <p className="mb-4 text-xs font-bold tracking-[0.4em] text-green-400 uppercase">
//             Cash Flow
//           </p>
//           <h3 className="mb-8 text-2xl font-black italic md:text-4xl">Takk for støtten, RU! 💸</h3>
//           <div className="flex flex-col items-center">
//             <CountUp
//               from={0}
//               to={RU_MONEY}
//               separator=" "
//               className="bg-gradient-to-b from-white to-green-400 bg-clip-text text-[9vh] font-black tracking-tighter text-transparent md:text-[14vh]"
//             />
//             <span className="mt-2 text-4xl font-bold text-green-500">KRONER</span>
//           </div>
//         </div>
//       </div>
//     </Slide>
//   );
// }

function NewUsers() {
  return (
    <StatSlide
      gradient="from-teal-400 to-emerald-900"
      label="Nye medlemmer"
      number={NEW_USERS}
      subtext="Velkommen til familien!"
    />
  );
}

function TotalUsers() {
  return (
    <Slide>
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8 text-center text-white">
        <h2 className="mb-8 text-xl font-bold text-gray-400 md:text-4xl">
          echo-familien teller nå...
        </h2>
        <CountUp
          from={0}
          to={TOTAL_USERS}
          separator=" "
          duration={3}
          className="animate-pulse bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-[15vh] font-black whitespace-nowrap text-transparent md:text-[20vh]"
        />
        <p className="mt-4 text-2xl font-bold tracking-widest uppercase md:text-4xl">Brukere</p>
      </div>
    </Slide>
  );
}

function TakkForNaa({
  scrollToSlide,
}: {
  scrollToSlide?: (index: number, instant?: boolean) => void;
}) {
  return (
    <Slide>
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black p-8 text-center text-white">
        <BackgroundBlob
          color="bg-indigo-900"
          className="-top-40 -left-40 h-[600px] w-[600px] opacity-20"
        />
        <BackgroundBlob
          color="bg-fuchsia-900"
          className="-right-40 -bottom-40 h-[600px] w-[600px] opacity-20"
        />

        <div className="z-10 flex flex-col items-center gap-6">
          <p className="text-xs font-bold tracking-[0.5em] text-white/40 uppercase">
            DET VAR ALT FOR I ÅR
          </p>

          <GradientText
            text="takk for følget"
            gradientFrom="#6366f1"
            gradientTo="#a855f7"
            className="text-6xl font-black tracking-tighter uppercase md:text-8xl"
          />

          <div className="max-w-md">
            <TextType
              className="text-lg font-medium text-white/70 md:text-xl"
              text={["Lykke til i 2026. 👋", "Gjør deg klar for et nytt år med echo!"]}
              typingSpeed={60}
              pauseDuration={2000}
              showCursor={true}
            />
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Linjeforeningen echo // Bergen
            </p>
          </div>

          <button
            onClick={() => scrollToSlide?.(0, true)}
            className="mt-8 text-xs font-bold tracking-widest text-white/40 uppercase underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Se oppsummeringen på nytt
          </button>
        </div>
      </div>
    </Slide>
  );
}

export default function Wrapped() {
  const [index, setIndex] = useState(0);
  const slides = [
    <Velkommen key="v" />,
    <Welcome key="w" />,
    <NewUsers key="nu" />,
    <Registrations key="r" />,
    <TopEventsStack key="t" />,
    <EventsPerGroup key="e" />,
    <Posts key="p" />,
    <Comments key="com" />,
    <Replies key="rep" />,
    <Reactions key="re" />,
    <BestComment key="bc" />,
    <Beer key="b" />,
    <Coffee key="c" />,
    <Jobs key="j" />,
    // <RuMoney key="ru" />,
    <TotalUsers key="tu" />,
    <TakkForNaa key="takk" />,
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Scroller slides={slides} onSlideChange={(newIndex) => setIndex(newIndex)} />
      <NavigationFooter current={index} total={slides.length} />
    </div>
  );
}
