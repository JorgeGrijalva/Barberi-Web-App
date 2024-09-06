"use client";

import { DefaultResponse } from "@/types/global";
import { Shop } from "@/types/shop";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { Button } from "@/components/button";
import Message3FillIcon from "remixicon-react/Message3FillIcon";
// import GlobeIcon from "@/assets/icons/globe";
import PhoneIcon from "@/assets/icons/phone";
import ClockIcon from "@/assets/icons/clock";
import { defineShopWorkingSchedule } from "@/utils/define-shop-working-schedule";
import { Translate } from "@/components/translate";
import { useBooking } from "@/context/booking";
import {
  usePathname,
  useRouter,
  // useSearchParams
} from "next/navigation";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Drawer } from "@/components/drawer";
import { useModal } from "@/hook/use-modal";
import { Types } from "@/context/booking/booking.reducer";
import { useTransition } from "react";
import VerifiedIcon from "@/assets/icons/verified";
import clsx from "clsx";

const ShopReviewPanel = dynamic(() => import("../shop-review-panel"), {
  loading: () => <LoadingCard />,
});

interface BookingProps {
  data?: DefaultResponse<Shop>;
  checkDate?: boolean;
}

export const MainInfo = ({ data, checkDate }: BookingProps) => {
  const { language, currency } = useSettings();
  const { t } = useTranslation();
  const { state, dispatch } = useBooking();
  const [isNavigating, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [isReviewPanelOpen, openReviewPanel, closeReviewPanel] = useModal();
  const { data: shopDetail } = useQuery(
    ["shop", data?.data.id, language?.locale],
    () => shopService.getById(data?.data.id, { lang: language?.locale, currency_id: currency?.id }),
    {
      initialData: data,
    }
  );
  let isButtonDisabled = false;
  if (!state.date && checkDate) {
    isButtonDisabled = true;
  }
  const { isShopClosed } = defineShopWorkingSchedule(data?.data);

  const handleButtonClick = () => {
    startTransition(() => {
      router.push(`/shops/${data?.data.slug}/booking`);
      // router.push(
      //   `/shops/${data?.data.slug}/booking${
      //     searchParams.toString() ? `?${searchParams.toString()}` : ""
      //   }`
      // );
      if (!pathname.includes("staff")) {
        dispatch({ type: Types.ResetBooking });
      }
    });
  };
  return (
    <div className="rounded-button py-5 px-5 border border-gray-link">
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <h2
            className={clsx(
              "xl:text-[28px] md:text-2xl text-xl font-semibold",
              shopDetail?.data?.verify && "line-clamp-1"
            )}
          >
            {shopDetail?.data.translation?.title}
          </h2>
          {shopDetail?.data?.verify && (
            <span>
              <VerifiedIcon />
            </span>
          )}
        </div>
        <Button
          onClick={openReviewPanel}
          size="xsmall"
          leftIcon={
            <div className="w-4">
              <Message3FillIcon size={16} />
            </div>
          }
          color="blackOutlined"
        >
          {t("add.comment")}
        </Button>
      </div>
      <div className="py-10 border-b border-gray-link">
        <Button
          color="black"
          fullWidth
          size="medium"
          disabled={isButtonDisabled}
          onClick={handleButtonClick}
          loading={isNavigating}
        >
          {t("book.now")}
        </Button>
      </div>
      {!!data?.data?.phone && (
        <div className="flex items-center gap-3 mt-3">
          <PhoneIcon />
          <a className="text-lg font-medium" href={`tel:${data.data.phone}`}>
            {data.data.phone}
          </a>
        </div>
      )}
      <div className="flex items-center gap-3 mt-3">
        <ClockIcon />
        <span className="text-lg font-medium">
          {isShopClosed ? <Translate value="closed" /> : <Translate value="open.now" />}
        </span>
      </div>
      {/* <div className="pt-3 mt-3 border-t border-gray-link"> */}
      {/*  <div className="border border-gray-link rounded-button bg-white bg-opacity-30 px-4 py-2.5 flex items-center gap-3"> */}
      {/*    <span className="text-red"> */}
      {/*      <DiscountIcon /> */}
      {/*    </span> */}
      {/*    <span className="text-sm">10% Off First Service use cod “NEWBEAUTY30”</span> */}
      {/*  </div> */}
      {/* </div> */}
      <Drawer
        open={isReviewPanelOpen}
        onClose={closeReviewPanel}
        position="bottom"
        withBorderRadius
      >
        <ShopReviewPanel id={data?.data.id} />
      </Drawer>
    </div>
  );
};
