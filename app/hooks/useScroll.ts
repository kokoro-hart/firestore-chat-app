import { useCallback, useRef } from "react";

export const useScroll = () => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    if (ref.current) {
      const element = ref.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [ref]);

  const moveDown = useCallback(() => {
    if (ref.current) {
      const element = ref.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "auto",
      });
    }
  }, [ref]);

  const scrollTop = useCallback(() => {
    if (ref.current) {
      const element = ref.current;
      element.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [ref]);

  return {
    ref,
    scrollTop,
    scrollDown,
    moveDown,
  };
};
