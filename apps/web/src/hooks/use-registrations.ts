import { useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";

import { WS } from "@/config";

const BASE_WS_URL = `${WS}://${process.env.NEXT_PUBLIC_BOOMTOWN_HOSTNAME}`;

/**
 * Hook that subscribes to the websocket to get the current
 * registration and waitlist count so that the user can get
 * real-time updates.
 *
 * @param happeningId the id of the happening to get registrations for
 * @param initialRegistrationCount the initial registration count
 * @param initialWaitlistCount the initial waitlist count
 * @returns the current registration and waitlist count
 */
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
