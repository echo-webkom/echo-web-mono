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

export default function Wrapped() {
  return (
    <>
      <Scroller slides={[<Red />, <Blue />, <Green />]}></Scroller>
    </>
  );
}
