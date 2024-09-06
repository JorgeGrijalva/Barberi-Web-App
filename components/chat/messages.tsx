import { GroupedMessage, IMessage } from "@/types/chat";
import { MessageCard } from "@/components/chat/message-card";
import dayjs from "dayjs";
import useUserStore from "@/global-store/user";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

interface ChatMessageProps {
  messages: GroupedMessage[];
  onEdit: (message: IMessage | null) => void;
  onReply: (message: IMessage | null) => void;
  onDelete: (message: IMessage) => void;
  chatId?: string;
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ messages, onReply, onEdit, onDelete, chatId }, ref) => {
    const { t } = useTranslation();
    const user = useUserStore((state) => state.user);
    if (messages.length === 0) {
      return (
        <div className="flex-1  flex items-center justify-center">
          <span>{t("there.are.no.messages")}</span>
        </div>
      );
    }
    return (
      <div
        id="messages"
        className="flex flex-col space-y-4 px-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex-1"
      >
        {messages.map((group) => (
          <div key={group.date}>
            <div className="text-center text-xs my-2">{dayjs(group.date).format("DD MMM, YY")}</div>
            <div className="flex flex-col gap-2">
              {group.messages.map((message) => (
                <MessageCard
                  onEdit={onEdit}
                  onReply={onReply}
                  data={message}
                  userId={user?.id}
                  key={message.id}
                  onDelete={onDelete}
                  chatId={chatId}
                />
              ))}
            </div>
          </div>
        ))}
        <div ref={ref} />
      </div>
    );
  }
);

export default ChatMessages;
