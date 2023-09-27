import { useState } from "react";

export function CoolComponent() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Hei, verden!</h1>
      <p>Du har klikket {count} ganger.</p>
      <button className="border px-3" onClick={increment}>
        Klikk meg!
      </button>
    </div>
  );
}
