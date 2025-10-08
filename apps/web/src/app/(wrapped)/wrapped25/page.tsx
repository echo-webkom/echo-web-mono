import TextType from "./components/TextType";
import Scroller from "./Scroller";

function Red() {
  return <div className="h-full w-full bg-red-500">Red Screen</div>;
}

function Blue() {
  return <div className="h-full w-full bg-blue-500">Blue Screen</div>;
}

function Green() {
  return <div className="h-full w-full bg-green-500">Green Screen</div>;
}

function Welcome() {
  return (
    <>
      <TextType
        text={["Endelig echo wrapped 2025", "Endelig echo wrapped 2025"]}
        typingSpeed={100}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="|"
      />
      <div>
        <br />
        <br />
        <br />
        <h1>Velkommen</h1>
      </div>
    </>
  );
}

export default function Wrapped() {
  return (
    <>
      <Scroller slides={[<Red />, <Blue />, <Welcome />]}></Scroller>
    </>
  );
}
