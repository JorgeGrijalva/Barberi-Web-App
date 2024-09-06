"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  getFirestore,
  getDocs,
  where,
  serverTimestamp,
  writeBatch,
  doc as firebaseDoc,
  deleteDoc,
} from "firebase/firestore";
import firebaseApp from "@/lib/firebase";

import ChatMessages from "@/components/chat/messages";
import { ChatForm } from "@/components/chat/chat-form";
import useUserStore from "@/global-store/user";
import { GroupedMessage, IChat, IMessage } from "@/types/chat";
import { groupMessagesByDate } from "@/utils/group-messages-by-date";
import { LoadingCard } from "@/components/loading";
import { addDoc, updateDoc } from "@firebase/firestore";
import dayjs from "dayjs";

interface ChatProps {
  recieverId?: number;
}

const Chat = ({ recieverId }: ChatProps) => {
  const [messages, setMessages] = useState<GroupedMessage[]>([]);
  const scroll = useRef<HTMLDivElement>(null);
  const user = useUserStore((state) => state.user);
  const [chatId, setChatId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [repliedMessage, setRepliedMessage] = useState<IMessage | null>(null);
  const [editedMessage, setEditedMessage] = useState<IMessage | null>(null);
  const db = getFirestore(firebaseApp);
  const isCreated = useRef(false);

  const fetchChat = async () => {
    const chatsRef = collection(db, "chat");
    const q = query(
      chatsRef,
      where("ids", "array-contains-any", [user?.id, recieverId]),
      orderBy("time", "desc")
    );
    await getDocs(q)
      .then(async (querySnapshot) => {
        const chats = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const isMine = data.ids.includes(user?.id);
          const isSameReciever = data.ids.includes(recieverId);
          const actualData: IChat = {
            id: doc.id,
            ids: data.ids,
            time: data.time,
            lastMessage: data.lastMessage,
          };
          if (isMine && isSameReciever) {
            return actualData;
          }
          return undefined;
        });
        const actualChat = chats.find((chatItem) => typeof chatItem !== "undefined");
        if (actualChat) {
          setChatId(actualChat.id);
        } else if (!isCreated.current) {
          isCreated.current = true;
          await addDoc(collection(db, "chat"), {
            ids: [user?.id, recieverId],
            time: serverTimestamp(),
          })
            .then((res) => {
              setChatId(res.id);
            })
            .catch(() => {
              isCreated.current = false;
            });
        }
      })
      .catch(async () => {
        isCreated.current = true;
        await addDoc(collection(db, "chat"), {
          ids: [user?.id, recieverId],
          time: serverTimestamp(),
        }).then((res) => {
          setChatId(res.id);
        });
      });

    scroll.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      fetchChat().catch(() => {
        setIsLoading(false);
      });
    }
  }, [recieverId, user?.id]);

  const fetchMessages = async () => {
    if (chatId) {
      const q = query(collection(db, "chat", chatId, "message"));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const fetchedMessages: IMessage[] = [];
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          const messageRef = doc.ref;
          const message = doc.data();
          fetchedMessages.push({
            id: doc.id,
            message: message.message,
            time: message.time,
            read: message.read,
            senderId: message.senderId,
            type: message.type,
            replyDocId: message.replyDocId,
            isLast: false,
          });

          if (message.senderId !== user?.id && !message.read) {
            batch.update(messageRef, {
              read: true,
            });
          }
        });
        fetchedMessages.sort((a, b) => (dayjs(a.time).isAfter(dayjs(b.time)) ? 1 : -1));
        if (fetchedMessages[querySnapshot.size - 1]) {
          fetchedMessages[querySnapshot.size - 1].isLast = true;
        }
        const groupedMessages = groupMessagesByDate(fetchedMessages);
        setMessages(groupedMessages);
        setIsLoading(false);

        await batch.commit();
      });
      return () => {
        unsubscribe();
      };
    }
    return () => undefined;
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteMessage = useCallback(
    async (message: IMessage) => {
      if (chatId) {
        await deleteDoc(firebaseDoc(db, "chat", chatId, "message", message.id));
        const chatRef = firebaseDoc(db, "chat", chatId);

        const messageBeforeLastMessage = messages?.at(-1)?.messages?.at(-2);
        if (message.isLast) {
          await updateDoc(chatRef, {
            lastMessage: messageBeforeLastMessage ? messageBeforeLastMessage.message : "",
            time: serverTimestamp(),
          });
        }
      }
    },
    [chatId, messages]
  );

  return (
    <div className="flex flex-col h-full chat-body">
      {isLoading ? (
        <div className="flex-1">
          <LoadingCard centered />
        </div>
      ) : (
        <ChatMessages
          onEdit={(message) => setEditedMessage(message)}
          onReply={(message) => setRepliedMessage(message)}
          messages={messages}
          onDelete={handleDeleteMessage}
          chatId={chatId}
          ref={scroll}
        />
      )}
      {/* <div ref={scroll} /> */}
      <ChatForm
        clearEditMessage={() => setEditedMessage(null)}
        clearReplyMessage={() => setRepliedMessage(null)}
        editedMessage={editedMessage}
        repliedMessage={repliedMessage}
        chatId={chatId}
      />
    </div>
  );
};

export default Chat;
