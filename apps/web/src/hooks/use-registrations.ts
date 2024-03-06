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
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as {
        registerCount: number;
        waitlistCount: number;
      };
      setRegisteredCount(message.registerCount);
      setWaitlistCount(message.waitlistCount);
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    return () => {
      ws.close();
    };
  }, [ws]);

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
