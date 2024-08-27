"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LuMousePointer2 } from "react-icons/lu";

import { useCursorWs } from "@/hooks/use-cursor-ws";

const id = Math.random().toString(36).substring(2, 15);
const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

export const Cursor = () => {
  const pathname = usePathname();
  const { cursors, sendMessage } = useCursorWs();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleUpdate = useCallback(
    (x: number, y: number) => {
      sendMessage({
        id,
        x,
        y,
        message: "",
        pathname,
        color: randomColor!,
      });
    },
    [pathname, sendMessage],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      setX(event.clientX);
      setY(event.clientY);

      const newX = x + window.scrollX;
      const newY = y + window.scrollY;

      handleUpdate(newX, newY);
    },
    [handleUpdate, x, y],
  );

  const handleScroll = useCallback(() => {
    const newX = x + window.scrollX;
    const newY = y + window.scrollY;

    handleUpdate(newX, newY);
  }, [handleUpdate, x, y]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const c = cursors
    .filter((cursor) => cursor.x > 0 && cursor.y > 0)
    .filter((cursor) => cursor.pathname === pathname)
    .filter((cursor) => cursor.id !== id);

  return (
    <CursorOverlay>
      {c.map(({ x, y, message, color }) => (
        <CursorRender key={`${x}${y}`} x={x} y={y} message={message} color={color} />
      ))}
    </CursorOverlay>
  );
};

export const CursorOverlay = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-1 overflow-hidden">
      {children}
    </div>
  );
};

export const CursorRender = ({
  x,
  y,
  message,
  color,
}: {
  x: number;
  y: number;
  message: string;
  color: string;
}) => {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: y - 10,
        left: x - 10,
        width: 24,
        height: 24,
        zIndex: 100,
      }}
    >
      <LuMousePointer2
        className="h-full w-full"
        style={{
          color,
          fill: color,
          stroke: "black",
          strokeWidth: 1,
        }}
      />
      {message}
    </div>
  );
};
