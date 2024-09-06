import { Unit } from "@/types/product";

export const unitify = (quantity?: number, interval?: number, unit?: Unit) => {
  const defaultQuantity = quantity || 0;
  const defaultInterval = interval || 1;
  if (unit) {
    if (unit.position === "after") {
      return `${unit.translation?.title} ${defaultQuantity * defaultInterval}`;
    }
    if (unit.position === "before") {
      return `${defaultQuantity * defaultInterval} ${unit.translation?.title}`;
    }
  }
  return defaultQuantity * defaultInterval;
};
