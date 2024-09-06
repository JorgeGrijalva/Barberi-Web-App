export const createRatingText = (review?: number | null) => {
  if (typeof review !== "undefined" && review !== null) {
    if (review <= 1) {
      return "very.bad";
    }
    if (review <= 2) {
      return "bad";
    }
    if (review <= 3) {
      return "not.bad";
    }
    if (review <= 4) {
      return "good";
    }
    if (review <= 4.5) {
      return "very.good";
    }
    if (review <= 5) {
      return "exceptional";
    }
    return "new";
  }
  return "new";
};
