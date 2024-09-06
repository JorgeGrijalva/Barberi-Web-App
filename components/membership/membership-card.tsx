import { Membership } from "@/types/membership";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import dayjs from "dayjs";

interface MembershipCardProps {
  data: Membership;
  onClick: () => void;
  isSelected?: boolean;
  expirationDate?: string;
  index: number;
  remainderSessions?: number;
}

const colors = [
  "#C2B6A4",
  "#C1E8FF",
  "#C6F4E4",
  "#FFD2E8",
  "#FFE6B4",
  "#E8E8E8",
  "#C3F8FF",
  "#F7D8FF",
  "#D8DCFF",
  "#F1D2D2",
  "#D6FFD2",
  "#FFEDD7",
];

export const MembershipCard = ({
  data,
  onClick,
  isSelected,
  expirationDate,
  index,
  remainderSessions,
}: MembershipCardProps) => {
  const { t } = useTranslation();
  return (
    <button
      className={clsx(
        "aspect-[2/1.2] rounded-button p-3 flex flex-col justify-between w-full bg-opacity-60",
        isSelected && "ring ring-dark ring-offset-2 rounded-button"
      )}
      style={{
        background: `linear-gradient(16deg, ${colors[index % colors.length]}, ${
          colors[(index + 1) % colors.length]
        }, ${colors[(index + 2) % colors.length]})`,
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        {data?.sessions === 1 ? (
          <div>
            <span className="md:text-base text-sm font-medium">{data.sessions_count}</span>
            {!!remainderSessions && (
              <span className="md:text-base text-sm font-medium"> / {remainderSessions}</span>
            )}
          </div>
        ) : (
          <span className="md:text-base text-sm font-medium">{t("unlimited")}</span>
        )}
        <span className="text-sm font-medium">{data.translation?.title}</span>
      </div>
      <div className="flex items-center justify-between w-full">
        <span className="text-xs">
          {t("duration")} {data.time}
        </span>
        {!!expirationDate && (
          <span className="text-sm">{dayjs(expirationDate).format("MMM DD, YYYY - HH:mm")}</span>
        )}
      </div>
    </button>
  );
};
