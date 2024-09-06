import { useEffect, useState } from "react";

const getReturnValues = (countDown: number) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [
    days < 0 ? 0 : days,
    hours < 0 ? 0 : hours,
    minutes < 0 ? 0 : minutes,
    seconds < 0 ? 0 : seconds,
  ];
};
export const useExpireDate = (targetDate?: string) => {
  const countDownDate = new Date(
    targetDate ? targetDate.replace("00:00:00", "23:59:00") : Date.now()
  ).getTime();

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};
