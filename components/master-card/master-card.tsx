import { Master } from "@/types/master";
import { useTranslation } from "react-i18next";
import { ImageWithFallBack } from "@/components/image";
import React from "react";
import { Price } from "@/components/price";
import { IconButton } from "@/components/icon-button";
import HeartFillOutlinedIcon from "@/assets/icons/heart-fill-outlined";
import HeartOutlinedIcon from "@/assets/icons/heart-outlined";
import { useLike } from "@/hook/use-like";
import clsx from "clsx";

interface MasterCardProps {
  data: Master;
  selected?: boolean;
}

export const MasterCard = ({ data, selected }: MasterCardProps) => {
  const { t } = useTranslation();
  const { isLiked, handleLikeDisLike } = useLike("master", data.id);
  return (
    <div
      className={clsx(
        "relative rounded-button overflow-hidden group justify-start h-full border border-gray-link",
        selected && "ring-2 ring-black"
      )}
    >
      <div className="absolute top-3 left-3 z-[1] text-dark">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleLikeDisLike();
          }}
        >
          {isLiked ? <HeartFillOutlinedIcon /> : <HeartOutlinedIcon size={26} />}
        </IconButton>
      </div>
      <div className="relative aspect-[198/182]">
        <ImageWithFallBack
          src={data?.img || ""}
          alt={data?.firstname || "master"}
          fill
          className="object-cover transition-all group-hover:scale-105"
        />
      </div>
      <div className="xl:pb-5 lg:pb-3 px-3 pb-2 text-start">
        <div className="flex items-center justify-between mt-3">
          <strong className="text-lg font-semibold ">{data?.firstname}</strong>
          <div className="rounded-button border border-gray-link w-7 h-7 flex items-center justify-center z-[1] bg-white bg-opacity-60">
            <span className="text-sm font-semibold">{data?.r_avg ?? 0}</span>
          </div>
        </div>
        <span className="text-sm text-gray-field">{data?.translation?.title || t("master")}</span>
        <div className="flex flex-wrap flex-col gap-1 pt-2.5 mt-2.5 border-t border-gray-link">
          <span className="text-sm">{t("starting.from")}</span>
          <strong className="text-lg font-bold">
            <Price number={data?.service_master?.price} />
          </strong>
        </div>
        {!!data?.service_master?.type?.length && (
          <div className="flex flex-wrap flex-col gap-1 pt-2.5 mt-2.5 border-t border-gray-link">
            <span className="text-sm">{t("service.place")}</span>
            <strong className="text-lg font-bold">{t(data?.service_master?.type)}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
