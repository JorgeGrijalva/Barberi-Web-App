import { IMessage } from "@/types/chat";
import clsx from "clsx";
import { TextMessage } from "@/components/chat/text-message";
import { ImageMessage } from "@/components/chat/image-message";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { MessageActionButton } from "@/components/chat/message-action-button";
import ReplyAllLineIcon from "remixicon-react/ReplyAllLineIcon";
import { useTranslation } from "react-i18next";
import PencilLineIcon from "remixicon-react/PencilLineIcon";
import TrashIcon from "@/assets/icons/trash";
import { getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "@/lib/firebase";
import { doc } from "@firebase/firestore";

interface MessageCardProps {
  data: IMessage;
  userId?: number;
  onEdit: (message: IMessage | null) => void;
  onReply: (message: IMessage | null) => void;
  onDelete: (message: IMessage) => void;
  chatId?: string;
}

export const MessageCard = ({
  data,
  userId,
  onReply,
  onEdit,
  onDelete,
  chatId,
}: MessageCardProps) => {
  const { t } = useTranslation();
  const [replidedMessage, setRepliedMessage] = useState<IMessage | null>(null);
  const handleReply = () => {
    onReply(data);
    onEdit(null);
  };

  const handleEdit = () => {
    onEdit(data);
    onReply(null);
  };

  const fetchRepliedMessage = async (messageId: string) => {
    if (chatId) {
      const db = getFirestore(firebaseApp);
      const q = doc(db, "chat", chatId, "message", messageId);
      await getDoc(q).then((snapShot) => {
        const message = snapShot.data();
        setRepliedMessage({
          id: snapShot.id,
          message: message?.message,
          time: message?.time,
          replyDocId: message?.replyDocId,
          senderId: message?.senderId,
          type: message?.type,
          read: message?.read,
          isLast: false,
        });
      });
    }
  };

  useEffect(() => {
    if (data?.replyDocId) {
      fetchRepliedMessage(data.replyDocId);
    }
  }, [data?.replyDocId]);

  return (
    <div className="chat-message">
      <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <Menu.Button as={Fragment}>
            <div className={clsx("flex items-end", userId === data.senderId && "justify-end")}>
              {data.type === "image" && (
                <ImageMessage repliedMessage={replidedMessage} data={data} userId={userId} />
              )}
              {(data.type === "text" || typeof data.type === "undefined") && (
                <TextMessage data={data} userId={userId} repliedMessage={replidedMessage} />
              )}
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={clsx(
              "absolute z-[2] mt-2 divide-y divide-gray-100 rounded-md bg-white dark:bg-darkBg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col overflow-hidden",
              data.senderId === userId ? "origin-top-right right-2" : "origin-top-left left-2"
            )}
          >
            <MessageActionButton
              onClick={() => {
                handleReply();
              }}
              icon={<ReplyAllLineIcon />}
              text={t("reply")}
            />
            {data.senderId === userId && (
              <MessageActionButton
                onClick={() => {
                  handleEdit();
                }}
                icon={<PencilLineIcon />}
                text={t("edit")}
              />
            )}
            {data.senderId === userId && (
              <MessageActionButton
                danger
                onClick={() => onDelete(data)}
                icon={<TrashIcon />}
                text={t("delete")}
              />
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
