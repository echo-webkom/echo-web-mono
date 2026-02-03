"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const QrScanner = () => {
  const [list, setList] = useState<string[]>(["hello", "hi", "lol"]);
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { qrbox: { width: 1000, height: 1000 }, fps: 10 },
      false,
    );

    const success = (result: string) => {
      console.log("removing " + result);
      setList((prev) => prev.filter((item) => item !== result));
    };

    const error = (err: any) => {
      const msg = String(err ?? "");
      if (msg.includes("NotFoundException")) return;
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);
  return (
    <>
      <div id="reader"></div>
      <ul>
        {list.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </>
  );
};
