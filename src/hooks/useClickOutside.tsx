import { useEffect } from "react";

type RefType = React.RefObject<HTMLElement | null>;

export const useClickOutside = (
  ref: RefType,
  handler: () => void,
  enabled: boolean = true,
) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;

      if (el.contains(e.target as Node)) return;

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
};
