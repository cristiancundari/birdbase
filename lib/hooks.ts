import { EffectCallback, useEffect, useState } from "react";

export function useModalInit(effect: EffectCallback, isOpen: boolean) {
  const [firstTime, setFirstTime] = useState(false);
  useEffect(() => {
    if (isOpen && !firstTime) {
      setFirstTime(true);
      effect();
    }
  }, [isOpen]);
}
