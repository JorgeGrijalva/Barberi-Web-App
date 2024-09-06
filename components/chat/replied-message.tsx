import { IMessage } from "@/types/chat";
import { IconButton } from "@/components/icon-button";
import CrossIcon from "@/assets/icons/cross";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import Image from "next/image";

interface RepliedMessageProps {
  data: IMessage;
  inProgress: boolean;
  onClear?: () => void;
  isMine?: boolean;
}

export const RepliedMessage = ({ data, inProgress, onClear, isMine }: RepliedMessageProps) => {
  const { t } = useTranslation();
  return (
    <div className={clsx("flex items-center gap-2 w-full ", inProgress ? "mb-4" : "mb-1")}>
      <div
        className={clsx(
          "h-full w-0.5 rounded-full",
          isMine ? "bg-white" : "bg-blue-link",
          data.type === "image" && inProgress && "min-h-[80px]",
          (data.type === "text" || typeof data.type === "undefined") &&
            inProgress &&
            "min-h-[30px]",
          (data.type === "text" || typeof data.type === "undefined") &&
            !inProgress &&
            "min-h-[14px]",
          data.type === "image" && !inProgress && "min-h-[60px]"
        )}
      />
      <div className="flex items-center justify-between flex-1">
        <div className="flex flex-col">
          {inProgress && <span className="text-xs text-blue-link">{t("replying.to")}</span>}
          {data.type === "image" ? (
            <Image
              src={data.message}
              alt={data.message}
              width={60}
              height={60}
              className="max-h-[60px] object-contain"
            />
          ) : (
            <span className="text-sm line-clamp-1">{data.message}</span>
          )}
        </div>
        {!!onClear && (
          <IconButton onClick={onClear}>
            <CrossIcon size={20} />
          </IconButton>
        )}
      </div>
    </div>
  );
};
