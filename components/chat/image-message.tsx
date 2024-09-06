import { IMessage } from "@/types/chat";
import clsx from "clsx";
import Image from "next/image";
import dayjs from "dayjs";
import DoubleCheckIcon from "@/assets/icons/double-check";
import CheckLineIcon from "remixicon-react/CheckLineIcon";
import { RepliedMessage } from "@/components/chat/replied-message";

interface ImageMessageProps {
  data: IMessage;
  userId?: number;
  repliedMessage: IMessage | null;
}

export const ImageMessage = ({ data, userId, repliedMessage }: ImageMessageProps) => (
  <div className="relative max-w-xs mx-2 order-2 ">
    <div
      className={clsx(
        "p-1 relative rounded-lg  text-base flex flex-col ",
        userId === data.senderId
          ? "rounded-br-none bg-primary text-white "
          : "rounded-bl-none bg-gray-card"
      )}
    >
      {repliedMessage && (
        <RepliedMessage
          data={repliedMessage}
          inProgress={false}
          isMine={data.senderId === userId}
        />
      )}
      <Image
        src={data.message}
        alt={data.message}
        height={200}
        width={200}
        className="w-auto object-cover rounded-md "
      />
    </div>
    <div
      className="flex items-center absolute bottom-1 right-2 gap-1"
      style={{ textShadow: "1px 1px 2px black" }}
    >
      <span className={clsx("text-xs drop-shadow-3xl text-white")}>
        {dayjs(data.time).format("HH:mm")}
      </span>
      {userId === data.senderId && (
        <div className="text-white">
          {data.read ? (
            <DoubleCheckIcon className="checkIcon" size={12} />
          ) : (
            <CheckLineIcon className="checkIcon" size={12} />
          )}
        </div>
      )}
    </div>
  </div>
);
