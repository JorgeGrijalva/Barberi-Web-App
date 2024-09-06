"use client";

import { DefaultResponse } from "@/types/global";
import { Shop } from "@/types/shop";
import { ImageWithFallBack } from "@/components/image";
import { Button } from "@/components/button";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { shopService } from "@/services/shop";
import { useTranslation } from "react-i18next";
import MapPinIcon from "@/assets/icons/map-pin";
import { createRatingText } from "@/utils/create-rating-text";
import dayjs from "dayjs";
import { IconButton } from "@/components/icon-button";
import ShareIcon from "@/assets/icons/share";
import HeartOutlinedIcon from "@/assets/icons/heart-outlined";
import { defineShopWorkingSchedule } from "@/utils/define-shop-working-schedule";
import { useLike } from "@/hook/use-like";
import HeartFillOutlinedIcon from "@/assets/icons/heart-fill-outlined";
import Link from "next/link";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import { useModal } from "@/hook/use-modal";
import VerifiedIcon from "@/assets/icons/verified";
import { ShopSocialsPanel } from "@/components/shop-social-panel";
import Chat3LineIcon from "remixicon-react/Chat3LineIcon";

const ShopShare = dynamic(
  () => import("../shop-share").then((component) => ({ default: component.ShopShare })),
  {
    loading: () => <LoadingCard />,
  }
);

interface TopInfoProps {
  data?: DefaultResponse<Shop>;
}

export const TopInfo = ({ data }: TopInfoProps) => {
  const { language, currency } = useSettings();
  const { t } = useTranslation();
  const { data: shopDetail } = useQuery(
    ["shop", data?.data.id, language?.locale],
    () => shopService.getById(data?.data.id, { lang: language?.locale, currency_id: currency?.id }),
    {
      initialData: data,
    }
  );
  const today = data?.data?.shop_working_days?.find(
    (workingDay) => workingDay.day === dayjs().format("dddd").toLocaleLowerCase()
  );
  const { isShopClosed } = defineShopWorkingSchedule(data?.data);
  const { isLiked, handleLikeDisLike } = useLike("shop", data?.data.id);
  const [isShareModalOpen, openShareModal, closeShareModal] = useModal();
  const [isSocialModalOpen, openSocialModal, closeSocialModal] = useModal();
  return (
    <div>
      <div className="relative rounded-button md:h-[330px] h-[260px] w-full overflow-hidden">
        <div className="absolute z-[1] md:top-5 md:right-5 top-3 right-3 flex items-center gap-2.5">
          {!!data?.data?.socials?.length && (
            <IconButton onClick={openSocialModal} className="border border-white rounded-full p-1">
              <Chat3LineIcon color="white" size={22} />
            </IconButton>
          )}
          <IconButton onClick={openShareModal}>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={handleLikeDisLike} className="text-white">
            {isLiked ? <HeartFillOutlinedIcon size={36} /> : <HeartOutlinedIcon />}
          </IconButton>
        </div>
        <ImageWithFallBack
          src={data?.data.background_img || ""}
          alt={data?.data.translation?.title || "banner"}
          className="object-cover w-full h-full"
          fill
          priority
          sizes="(max-width: 376px) 340px, (max-width: 568px) 550px, (768px) 740px, (max-width: 992px) 960px, (max-width:1200px) 1160px, 1440px"
        />
        <div className="store-bg absolute w-full h-full top-0 left-0" />
        <div className="absolute z-[1] bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <div className="relative md:w-20 md:h-20 w-14 h-14 rounded-full overflow-hidden border-2 border-white mb-2">
              <ImageWithFallBack
                src={data?.data.logo_img || ""}
                alt={data?.data.translation?.title || "shop"}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="lg:text-[32px] md:text-3xl text-2xl font-semibold text-white line-clamp-1">
                {shopDetail?.data.translation?.title}
              </h1>
              {shopDetail?.data?.verify && (
                <span>
                  <VerifiedIcon />
                </span>
              )}
            </div>
            <div className="md:flex items-center gap-1 text-white hidden">
              <MapPinIcon />
              <span className="text-sm line-clamp-1">{shopDetail?.data.translation?.address}</span>
            </div>
            <div className="md:flex items-center gap-3 text-white mt-3 hidden">
              <div className="flex items-center gap-2 ">
                <div className="w-10 h-10 rounded-button bg-white bg-opacity-30 backdrop-blur-md flex items-center justify-center text-sm ">
                  {data?.data.r_avg || 0}
                </div>
                <span className="text-sm font-medium">{t(createRatingText(data?.data.r_avg))}</span>
              </div>
              <div className="rounded-full w-2 h-2 bg-white bg-opacity-30" />
              <span className="text-sm">
                {data?.data.r_count || 0} {t("reviews")}
              </span>
              <div className="rounded-full w-2 h-2 bg-white bg-opacity-30" />
              <span className="text-sm">{isShopClosed ? t("closed") : t("open")}</span>
              {!isShopClosed && (
                <>
                  <div className="rounded-full w-2 h-2 bg-white bg-opacity-30" />
                  <span className="text-sm">
                    {today?.from} - {today?.to}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <Button
              color="whiteOutlined"
              size="small"
              as={Link}
              href={`/shops/${data?.data.slug}/gallery`}
            >
              {t("see.photos")}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between md:hidden my-4">
        <div className="flex items-center gap-1 ">
          <MapPinIcon />
          <span className="text-sm line-clamp-1">{shopDetail?.data.translation?.address}</span>
        </div>
        <div className="w-10 h-10 rounded-button flex items-center justify-center text-sm border border-dark">
          {data?.data.r_avg || 0}
        </div>
      </div>
      <div className="flex items-center gap-3 justify-between mb-4 md:hidden">
        <span className="text-sm font-medium">{createRatingText(data?.data.r_avg)}</span>
        <div className="rounded-full w-2 h-2 bg-gray-link" />
        <span className="text-sm">
          {data?.data.r_count || 0} {t("reviews")}
        </span>
        <div className="rounded-full w-2 h-2 bg-gray-link " />
        <span className="text-sm">{isShopClosed ? t("closed") : t("open")}</span>
        {!isShopClosed && (
          <>
            <div className="rounded-full w-2 h-2 bg-gray-link " />
            <span className="text-sm">
              {today?.from} - {today?.to}
            </span>
          </>
        )}
      </div>
      <div className="md:hidden">
        <Button
          color="blackOutlined"
          size="small"
          fullWidth
          as={Link}
          href={`/shops/${data?.data.slug}/gallery`}
        >
          {t("see.all.photos")}
        </Button>
      </div>
      <Modal isOpen={isShareModalOpen} onClose={closeShareModal} withCloseButton>
        <ShopShare data={data?.data} />
      </Modal>
      <Modal isOpen={isSocialModalOpen} onClose={closeSocialModal} withCloseButton>
        <ShopSocialsPanel list={data?.data?.socials} />
      </Modal>
    </div>
  );
};
