export const generateRandomNumbers = (length = 30, limit = 20) =>
  Array.from({ length }, () => Math.floor(Math.random() * limit));
