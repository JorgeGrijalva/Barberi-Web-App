import { useState, useEffect } from "react";

export const useTimer = (duration: number) => {
  const [time, setTime] = useState(duration);
  const [isTimeOver, setIsTimeOver] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isTimeOver) {
      interval = setInterval(
        () =>
          setTime((prev) => {
            const updatedTime = prev - 1;
            if (updatedTime === 0) {
              setIsTimeOver(true);
              setTime(0);
            }
            return updatedTime;
          }),
        1000
      );
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTimeOver]);

  return time;
};
