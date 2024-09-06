import { GroupedMessage, IMessage } from "@/types/chat";
import dayjs from "dayjs";

export const groupMessagesByDate = (messages: IMessage[]) => {
  let lastDate = new Date(Date.now()).toISOString();
  const groupedMessages: GroupedMessage[] = [];
  messages.forEach((message) => {
    if (dayjs(message.time).isSame(dayjs(lastDate), "day")) {
      const currentGroupedMessage = groupedMessages.findIndex((groupedMessage) =>
        dayjs(groupedMessage.date).isSame(dayjs(message.time), "day")
      );
      if (currentGroupedMessage < 0) {
        groupedMessages.push({ date: lastDate, messages: [message] });
      } else {
        groupedMessages[currentGroupedMessage].messages.push(message);
      }
    } else {
      lastDate = message.time;
    }
  });
  return groupedMessages;
};
