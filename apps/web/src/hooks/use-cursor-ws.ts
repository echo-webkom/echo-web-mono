import { useCallback, useEffect, useMemo, useState } from "react";

const CURSOR_WS_URL = "ws://localhost:8005/ws";

type Cursor = {
  id: string;
  x: number;
  y: number;
  message: string;
  pathname: string;
  color: string;
};

type IncomingMessage = Array<Cursor>;

type OutgoingMessage = Cursor;

export const useCursorWs = () => {
  const [lastJsonMessage, setLastJsonMessage] = useState<IncomingMessage | null>(null);
  const websocket = useMemo(() => new WebSocket(CURSOR_WS_URL), []);

  const sendMessage = useCallback(
    (message: OutgoingMessage) => {
      if (websocket.readyState !== WebSocket.OPEN) return;
      websocket.send(JSON.stringify(message));
    },
    [websocket],
  );

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = JSON.parse(event.data as string) as IncomingMessage;
      setLastJsonMessage(message);
    };

    websocket.addEventListener("message", handler);

    return () => {
      websocket.removeEventListener("message", handler);
    };
  }, [websocket]);

  const cursors = lastJsonMessage ?? [];

  return {
    cursors,
    sendMessage,
  };
};
