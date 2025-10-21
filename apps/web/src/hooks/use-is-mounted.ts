import { useEffect, useEffectEvent, useState } from "react";

/**
 * Hook to check if component has mounted on the client side.
 * Useful for avoiding hydration mismatches when using client-side only values like Math.random().
 *
 * @returns boolean - true if component is mounted on client, false otherwise
 */
export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);

  const onMount = useEffectEvent(() => {
    setMounted(true);
  });

  useEffect(() => {
    onMount();
  }, []);

  return mounted;
};
