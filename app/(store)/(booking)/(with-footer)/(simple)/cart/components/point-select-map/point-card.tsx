import { DeliveryPoint } from "@/types/global";
import { useTranslation } from "react-i18next";
import MapPinLineIcon from "remixicon-react/MapPinLineIcon";
import ShirtLineIcon from "remixicon-react/ShirtLineIcon";
import { useSettings } from "@/hook/use-settings";

interface PointCardProps {
  data: DeliveryPoint;
  onSelect: (point: DeliveryPoint) => void;
}

export const PointCard = ({ data, onSelect }: PointCardProps) => {
  const { language } = useSettings();
  const { t } = useTranslation();
  return (
    <button
      className="py-2 px-3 rounded-2xl bg-white dark:bg-gray-darkSegment"
      onClick={() => onSelect(data)}
    >
      <div className="test-base font-medium text-start">{data.translation?.title}</div>
      <div className="flex items-center gap-1 text-gray-field mt-2 mb-1">
        <MapPinLineIcon size={16} />
        <span className="text-xs text-gray-field line-clamp-1 text-start">
          {data.address?.[language?.locale || ""]}
        </span>
      </div>
      <div>
        {data.fitting_rooms && data.fitting_rooms > 0 ? (
          <div className="flex items-center gap-1 ">
            <ShirtLineIcon size={16} />
            <span className="text-xs">
              {data.fitting_rooms} {t("fitting.rooms")}
            </span>
          </div>
        ) : (
          <span className="text-xs">{t("no.fitting.rooms")}</span>
        )}
      </div>
    </button>
  );
};
