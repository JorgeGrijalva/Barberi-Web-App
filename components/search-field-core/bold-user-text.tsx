export const BoldUserText = ({
  length,
  offset,
  string,
}: {
  length: number;
  offset: number;
  string: string;
}) => {
  if (length === 0 && offset === 0) {
    return string;
  }
  const userText = string.substring(offset, offset + length);
  const stringBefore = string.substring(0, offset);
  const stringAfter = string.substring(offset + length);
  return `${stringBefore}<b>${userText}</b>${stringAfter}`;
};
