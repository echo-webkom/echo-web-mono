import {useState} from "react";

export const CoolComponent = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Hei, verden!</h1>
      <p>Du har klikket {count} ganger.</p>
      <button className="border px-3" onClick={increment}>
        Klikk meg!
      </button>
    </div>
  );
};
