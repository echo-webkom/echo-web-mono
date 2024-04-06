import { useEffect, type RefObject } from "react";

/**
 * Hook that runs a function when the user clicks outside the refs
 *
 * @param callback the function to run when the user clicks outside the refs
 * @param refs the refs to check if the user clicked outside
 */
export function useOutsideClick(callback: () => void, refs: Array<RefObject<HTMLElement>>) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
      );
      if (isOutside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
}
