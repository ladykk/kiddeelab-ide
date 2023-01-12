import { useRef, useEffect } from "react";

export function useChatScroll<T>(
  dep: T
): React.MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (
        ref.current.scrollTop + ref.current.clientHeight + 50 >=
        ref.current.scrollHeight
      )
        ref.current.scrollTop = ref.current.scrollHeight;

      console.log(ref.current.scrollTop);
      console.log(ref.current.clientHeight);
      console.log(ref.current.scrollHeight);
    }
  }, [dep]);
  return ref;
}
