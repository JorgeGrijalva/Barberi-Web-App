import clsx from "clsx";
import dayjs from "dayjs";
import DoubleCheckIcon from "@/assets/icons/double-check";
import CheckLineIcon from "remixicon-react/CheckLineIcon";
import { IMessage } from "@/types/chat";
import { RepliedMessage } from "@/components/chat/replied-message";

interface TextMessageProps {
  data: IMessage;
  userId?: number;
  repliedMessage: IMessage | null;
}

export const TextMessage = ({ data, userId, repliedMessage }: TextMessageProps) => (
  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-end">
    <div
      className={clsx(
        "pl-4 py-2 relative rounded-lg  text-base flex flex-col  ",
        userId === data.senderId
          ? "rounded-br-none bg-primary text-white pr-14"
          : "rounded-bl-none bg-gray-card pr-12 dark:text-dark"
      )}
    >
      {repliedMessage && (
        <RepliedMessage
          data={repliedMessage}
          inProgress={false}
          isMine={data.senderId === userId}
        />
      )}
      {data.message}
      <div className="flex items-center absolute bottom-1 right-1 gap-1">
        <span className={clsx(userId === data.senderId && "text-white", "text-xs")}>
          {dayjs(data.time).format("HH:mm")}
        </span>
        {userId === data.senderId && (
          <div className="text-white">
            {data.read ? <DoubleCheckIcon size={12} /> : <CheckLineIcon size={12} />}
          </div>
        )}
      </div>
    </div>
  </div>
);
