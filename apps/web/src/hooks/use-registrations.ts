import { useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";

const BASE_WS_URL = `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${process.env.NEXT_PUBLIC_BOOMTOWN_HOSTNAME}`;

export function useRegistrations(
  happeningId: string,
  initialRegistrationCount: number,
  initialWaitlistCount: number,
) {
  const [registeredCount, setRegisteredCount] = useState(initialRegistrationCount);
  const [waitlistCount, setWaitlistCount] = useState(initialWaitlistCount);

  const socketUrl = useMemo(() => `${BASE_WS_URL}/ws/${happeningId}`, [happeningId]);
  const { lastJsonMessage } = useWebSocket<{
    registerCount: number;
    waitlistCount: number;
  }>(socketUrl);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setRegisteredCount(lastJsonMessage.registerCount);
      setWaitlistCount(lastJsonMessage.waitlistCount);
    }
  }, [lastJsonMessage]);

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
