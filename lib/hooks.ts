import { useResizeObserver } from "@mantine/hooks";
import React, {
  EffectCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export function useModalInit(effect: EffectCallback, isOpen: boolean) {
  const [firstTime, setFirstTime] = useState(false);
  useEffect(() => {
    if (isOpen && !firstTime) {
      setFirstTime(true);
      effect();
    }
  }, [isOpen, effect, firstTime]);
}
