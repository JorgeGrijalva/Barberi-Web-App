import { useEffect, useRef, useState } from "react";

export const useCountDown = (total: number, ms = 1000) => {
  const [counter, setCountDown] = useState(total);
  const [startCountDown, setStartCountDown] = useState(false);
  const intervalId = useRef<NodeJS.Timeout>();
  const start: () => void = () => setStartCountDown(true);
  const pause: () => void = () => setStartCountDown(false);
  const reset: () => void = () => {
    clearInterval(intervalId.current);
    setStartCountDown(true);
    setCountDown(total);
  };

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (startCountDown && counter > 0) {
        setCountDown((oldCounter) => oldCounter - 1);
      }
    }, ms);
    if (counter === 0) clearInterval(intervalId.current);
    return () => clearInterval(intervalId.current);
  }, [startCountDown, counter, ms]);

  return { counter, start, pause, reset };
};
