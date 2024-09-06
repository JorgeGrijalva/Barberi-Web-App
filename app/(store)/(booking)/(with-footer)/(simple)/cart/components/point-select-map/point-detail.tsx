import { DeliveryPoint } from "@/types/global";
import { useTranslation } from "react-i18next";
import MapPinLineIcon from "remixicon-react/MapPinLineIcon";
import ShirtLineIcon from "remixicon-react/ShirtLineIcon";
import { IconButton } from "@/components/icon-button";
import AnchorLeft from "@/assets/icons/anchor-left";
import { Button } from "@/components/button";
import { ImageWithFallBack } from "@/components/image";
import { useSettings } from "@/hook/use-settings";

interface PointDetailProps {
  data: DeliveryPoint;
  onBack: () => void;
  onSelect: (point: DeliveryPoint) => void;
}

export const PointDetail = ({ data, onBack, onSelect }: PointDetailProps) => {
  const { language } = useSettings();
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl bg-white h-full dark:bg-gray-darkSegment">
      <div className="overflow-y-auto h-full flex flex-col">
        <div className="relative max-h-60 w-full aspect-[1/2]">
          <div className="absolute top-2 left-2 z-[1]">
            <IconButton size="small" rounded color="white" onClick={onBack}>
              <AnchorLeft />
            </IconButton>
          </div>
          <ImageWithFallBack
            src={data.img}
            alt={data.translation?.title || "point"}
            fill
            className="w-full object-cover rounded-2xl"
          />
        </div>
        <div className="pt-2 px-3 pb-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="test-base font-medium text-start">{data.translation?.title}</div>
            <div className="flex items-start gap-1 text-gray-field mt-2 mb-1">
              <MapPinLineIcon size={16} />
              <span className="text-xs text-gray-field line-clamp-2 text-start">
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
            <ul className="my-4">
              {data.working_days.map((workingDay) => (
                <li key={workingDay.id} className="flex items-center justify-between">
                  <span className="text-sm">{t(workingDay.day)}</span>
                  <span className="text-sm">
                    {workingDay.from} - {workingDay.to}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Button fullWidth onClick={() => onSelect(data)}>
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};
