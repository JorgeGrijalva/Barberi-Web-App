import { Timestamp } from "@firebase/firestore-types";

export interface IChat {
  id: string;
  ids: number[];
  lastMessage?: string;
  time: Timestamp;
}

export interface IMessage {
  id: string;
  message: string;
  read: boolean;
  senderId: number;
  time: string;
  type?: "text" | "image";
  replyDocId?: string;
  isLast: boolean;
}

export type MessageType = "text" | "image";

export interface CreateMessageBody {
  message: string;
  read: boolean;
  senderId?: number;
  time: string;
  type?: MessageType;
  replyDocId?: string;
}

export interface GroupedMessage {
  date: string;
  messages: IMessage[];
}
