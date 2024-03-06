import { useEffect, useMemo, useState } from "react";

const BASE_WS_URL = `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${process.env.NEXT_PUBLIC_BOOMTOWN_HOSTNAME}`;

export function useRegistrations(
  happeningId: string,
  initialRegistrationCount: number,
  initialWaitlistCount: number,
) {
  const [registeredCount, setRegisteredCount] = useState(initialRegistrationCount);
  const [waitlistCount, setWaitlistCount] = useState(initialWaitlistCount);

  const ws = useMemo(() => new WebSocket(`${BASE_WS_URL}/ws/${happeningId}`), [happeningId]);

  useEffect(() => {
    ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      // eslint-disable-next-line no-console
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [ws]);

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data as string) as {
      registerCount: number;
      waitlistCount: number;
    };
    // eslint-disable-next-line no-console
    console.log(message);
    setRegisteredCount(message.registerCount);
    setWaitlistCount(message.waitlistCount);
  };

  ws.onerror = (event) => {
    console.error("WebSocket error:", event);
  };

  if (!BASE_WS_URL) {
    return {
      registeredCount: initialRegistrationCount,
      waitlistCount: initialWaitlistCount,
    };
  }

  return {
    registeredCount,
    waitlistCount,
  };
}
