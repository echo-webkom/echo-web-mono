function getTileColor(char: string, index: number, solution: string) {
  if (!char) return "";
  if (solution[index] === char) return "bg-green-500 text-white border-green-500";
  if (solution.includes(char)) return "bg-yellow-500 text-white border-yellow-500";
  return "bg-gray-500 text-white border-gray-500";
}

export default function Row({
  attempt,
  solution,
  submitted,
}: {
  attempt: string;
  solution: string;
  submitted: boolean;
}) {
  const WORD_LENGHT = 5;
  const tiles = [];

  for (let i = 0; i < WORD_LENGHT; i++) {
    const char = attempt[i] ?? "";
    const color = submitted ? getTileColor(char, i, solution) : "";

    tiles.push(
      <div
        key={i}
        className={`m-1 flex h-18 w-18 items-center justify-center border-2 border-gray-400 text-5xl uppercase ${color}`}
      >
        {char}
      </div>,
    );
  }

  return <div className="flex- flex justify-center">{tiles}</div>;
}
