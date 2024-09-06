"use client";

import { Shop } from "@/types/shop";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import MapPinIcon from "@/assets/icons/map-pin";
import { useSettings } from "@/hook/use-settings";
import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { DefaultResponse } from "@/types/global";
import { ImageWithFallBack } from "@/components/image";
import { Price } from "@/components/price";
import { useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/context/booking";
import Image from "next/image";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Link from "next/link";
import { createMapUrl } from "@/utils/create-map-url";
import { bookingService } from "@/services/booking";
import utc from "dayjs/plugin/utc";
import { useTransition } from "react";
import { useModal } from "@/hook/use-modal";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { BookingService, Types } from "@/context/booking/booking.reducer";
import useUserStore from "@/global-store/user";
import VerifiedIcon from "@/assets/icons/verified";

const GiftCartSelect = dynamic(
  () => import("./gift-cart-select").then((component) => ({ default: component.GiftCartSelect })),
  {
    loading: () => <LoadingCard />,
  }
);

const BookingCouponCheck = dynamic(() =>
  import("../coupon-check").then((component) => ({ default: component.BookingCouponCheck }))
);

dayjs.extend(utc);

interface BookingTotalProps {
  data?: DefaultResponse<Shop>;
  nextPage?: string;
  onClick?: () => void;
  isLoading?: boolean;
  checkStaff?: boolean;
  checkDate?: boolean;
  checkPayment?: boolean;
  checkLocation?: boolean;
  showCoupon?: boolean;
  runCalculate?: boolean;
  checkNotePageAuth?: boolean;
}

dayjs.extend(customParseFormat);

export const BookingTotal = ({
  data,
  nextPage,
  onClick,
  isLoading,
  checkStaff,
  checkDate,
  checkPayment,
  checkLocation,
  checkNotePageAuth,
  showCoupon = false,
  runCalculate = false,
}: BookingTotalProps) => {
  const { language, currency } = useSettings();
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { state, dispatch } = useBooking();
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const [isGiftCartModalOpen, openGiftCartModal, closeGiftCartModal] = useModal();
  const { data: shopDetail } = useQuery(
    ["shop", data?.data.id, language?.locale],
    () => shopService.getById(data?.data.id, { lang: language?.locale, currency_id: currency?.id }),
    {
      initialData: data,
    }
  );
  const calculateBody = {
    data: state.services.map((service) => ({
      service_master_id: service.master?.service_master?.id,
      user_member_ship_id: service.userMemberShipId,
      service_extras: service.selected_extra_ids?.length ? service.selected_extra_ids : undefined,
    })),
    currency_id: currency?.id,
    payment_id: state.payment?.id,
    start_date: `${dayjs(state.date).format("YYYY-MM-DD")} ${state.time}`,
    user_gift_cart_id: state.giftCart?.shopGiftCartId,
    coupon: state.coupon,
  };
  const hasMembership = calculateBody.data.some((service) => service.user_member_ship_id);
  const {
    data: calculateRes,
    isError: isCalculateError,
    isFetching: isCalculating,
    isSuccess: isCalculateSuccess,
  } = useQuery(
    ["bookingCalculate", state],
    () => bookingService.calculate(calculateBody, { lang: language?.locale }),
    {
      enabled: !!user && !!state.time && state.services.length > 0 && runCalculate,
      // && !!state.payment
      retry: false,
      meta: {
        showErrorMessageFromServer: true,
      },
    }
  );
  const localTotalPrice = state.services.reduce((acc, curr) => {
    const extrasTotal = curr?.selected_extra_ids?.reduce((extraAcc, extraId) => {
      const extra = curr?.service_extras?.find((item) => item.id === extraId);
      return extraAcc + (extra?.price || 0);
    }, 0);
    return (
      acc +
      (curr?.master?.service_master?.price ??
        curr.min_price ??
        curr.price ??
        curr.total_price ??
        0) +
      (extrasTotal || 0)
    );
  }, 0);
  const totalPrice =
    typeof calculateRes?.data === "undefined" ? localTotalPrice : calculateRes?.data.total_price;
  const totalTime = state.services.reduce(
    (acc, curr) => acc + (curr?.master?.service_master?.interval ?? curr.interval),
    0
  );
  const endTime = dayjs(
    `${dayjs(state.date).format("YYYY-MM-DD")} ${state.time}`,
    "YYYY-MM-DD HH:mm"
  ).add(totalTime, "minutes");

  let tempNextPage = nextPage;
  if (state.master && nextPage === "/booking/staff" && state.time) {
    tempNextPage = "/booking/note";
  }
  if (state.master && nextPage === "/booking/staff-select" && state.time) {
    tempNextPage = "/booking/note";
  }
  if (state.master && nextPage === "/booking/staff") {
    tempNextPage = "/booking/date";
  }
  if (
    state.services.some((service) => service.type === "offline_out") &&
    nextPage === "/booking/note" &&
    !state.address
  ) {
    tempNextPage = "/booking/location";
  }

  let isDisabled = state.services.length === 0;

  if (checkStaff) {
    isDisabled = state.services.some((service) => typeof service.master === "undefined");
  }
  if (checkDate) {
    isDisabled = !state.time;
  }

  if (checkPayment) {
    isDisabled = !state.payment;
  }
  if (checkLocation) {
    isDisabled = !state.address;
  }

  if (checkNotePageAuth) {
    isDisabled = !user;
  }

  const handleButtonClick = () => {
    const isNotePage = nextPage === "/booking/payment";
    if (onClick) {
      if (isNotePage) {
        if (calculateRes?.data?.total_price === 0) {
          onClick();
          return;
        }
      } else {
        onClick();
        return;
      }
    }
    startTransition(() =>
      router.push(
        `/shops/${shopDetail?.data.slug}${tempNextPage || "/bookings"}${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`
      )
    );
  };
  const allErrors = calculateRes?.data.items
    .flatMap((item) => item.errors)
    .filter((item) => typeof item !== "undefined");

  return (
    <div className="fixed lg:static bottom-0 w-screen lg:w-auto left-0 lg:rounded-button rounded-t-button py-5 lg:px-5 px-4 lg:border border-gray-link shadow-fixedBooking lg:shadow-none bg-white">
      <div className="hidden lg:flex items-center gap-4 border-b border-gray-link pb-7">
        <div className="w-20 h-20 relative rounded-full border border-gray-link aspect-square ">
          <ImageWithFallBack
            src={shopDetail?.data?.logo_img || ""}
            alt={shopDetail?.data.translation?.title || "shop"}
            fill
            className="object-contain rounded-full w-20 h-20"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[28px] font-semibold line-clamp-1">
              {shopDetail?.data.translation?.title}
            </h2>
            {/* <Link */}
            {/*  href={`/shops/${shopDetail?.data?.slug}${ */}
            {/*    searchParams.toString() ? `?${searchParams.toString()}` : "" */}
            {/*  }`} */}
            {/*  className="text-[28px] font-semibold line-clamp-1 hover:underline" */}
            {/* > */}
            {/*  {shopDetail?.data.translation?.title} */}
            {/* </Link> */}
            {shopDetail?.data?.verify && (
              <span>
                <VerifiedIcon />
              </span>
            )}
          </div>
          <Link
            className="flex items-start gap-1"
            href={createMapUrl(
              shopDetail?.data.lat_long.latitude,
              shopDetail?.data.lat_long.longitude
            )}
            target="_blank"
          >
            <MapPinIcon />
            <p className="text-sm line-clamp-2">{shopDetail?.data.translation?.address}</p>
          </Link>
        </div>
      </div>
      {!!state.master && (
        <div className="flex items-center gap-1 border-b border-gray-link py-4">
          <div className="w-14 h-14 relative">
            <Image
              src={state.master.img}
              alt={state.master.firstname || "master"}
              className="rounded-full object-cover"
              fill
            />
          </div>
          <div>
            <p className="text-xl font-medium">
              {state.master.firstname} {state.master?.lastname}
            </p>
            <span className="text-gray-field text-base font-semibold">{t("master")}</span>
          </div>
        </div>
      )}
      {!!state.time && (
        <div className="hidden lg:block border-b border-gray-link py-4">
          <p className="text-xl font-semibold">
            {new Date(state.date || "").toLocaleDateString(language?.locale || "en", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            {t("at")} {state.time}
          </p>
          <span className="text-base text-gray-field font-medium">
            {totalTime}
            {t("min")} {t("duration")} {t("ends.at")}{" "}
            {dayjs().isSame(endTime, "day")
              ? endTime.format("HH:mm")
              : endTime.format("MMM DD, YYYY HH:mm")}
          </span>
        </div>
      )}
      {state.services.length !== 0 && (
        <div className="hidden lg:block border-b border-gray-link">
          {state.services.map((service) => (
            // eslint-disable-next-line no-use-before-define
            <ServiceTotalInfo key={service.id} service={service} state={state} />
          ))}
        </div>
      )}
      {!!calculateRes?.data?.coupon_price && (
        <div className="hidden lg:flex items-center justify-between py-7 text-xl border-b border-gray-link">
          <strong>{t("coupon")}</strong>
          <strong>
            <Price number={calculateRes?.data?.coupon_price} />
          </strong>
        </div>
      )}

      {!!calculateRes?.data.total_discount && (
        <div className="hidden lg:flex items-center justify-between py-7 text-xl border-b border-gray-link">
          <strong>{t("total.discount")}</strong>
          <strong>
            <Price number={calculateRes?.data.total_discount} />
          </strong>
        </div>
      )}

      {!!calculateRes?.data.total_gift_cart_price && (
        <div className="hidden lg:flex items-center justify-between py-7 text-xl border-b border-gray-link">
          <strong>{t("total.gift.card")}</strong>
          <strong>
            <Price number={calculateRes?.data?.total_gift_cart_price} />
          </strong>
        </div>
      )}

      {/* {!!calculateRes?.data.total_commission_fee && ( */}
      {/*  <div className="hidden lg:flex items-center justify-between py-7 text-xl border-b border-gray-link"> */}
      {/*    <strong>{t("total.commission.fee")}</strong> */}
      {/*    <strong> */}
      {/*      <Price number={calculateRes?.data.total_commission_fee} /> */}
      {/*    </strong> */}
      {/*  </div> */}
      {/* )} */}

      {!!calculateRes?.data.total_service_fee && (
        <div className="hidden lg:flex items-center justify-between py-7 text-xl border-b border-gray-link">
          <strong>{t("total.service.fee")}</strong>
          <strong>
            <Price number={calculateRes?.data.total_service_fee} />
          </strong>
        </div>
      )}

      {!!calculateRes?.data?.total_extra_price && (
        <div className="hidden lg:flex items-center justify-between py-7 text-xl border-b border-gray-link">
          <strong>{t("total.extras.price")}</strong>
          <strong>
            <Price number={calculateRes?.data?.total_extra_price} />
          </strong>
        </div>
      )}

      <div className="hidden lg:flex items-center justify-between py-7 text-[26px] font-semibold">
        <strong>{t("total")}</strong>
        <strong>
          <Price number={totalPrice ?? calculateRes?.data.total_price} />
        </strong>
      </div>
      <div>
        {allErrors?.map((error) => (
          <p className="text-red text-sm" role="alert" key={error}>
            {error}
          </p>
        ))}
      </div>
      {showCoupon && (
        <BookingCouponCheck
          defaultValue={state.coupon}
          shopId={shopDetail?.data.id}
          onCouponCheckSuccess={(coupon) =>
            dispatch({
              type: Types.UpdateCoupon,
              payload: {
                name: coupon.name,
              },
            })
          }
          onCouponCheckError={() =>
            dispatch({
              type: Types.UpdateCoupon,
              payload: {
                name: undefined,
              },
            })
          }
        />
      )}
      <div className="mt-4 flex flex-col gap-4">
        {onClick && !!user && isCalculateSuccess && !hasMembership && (
          <Button
            color="blackOutlined"
            size="medium"
            fullWidth
            onClick={() =>
              state.giftCart ? dispatch({ type: Types.DeleteGiftCart }) : openGiftCartModal()
            }
          >
            {t(state.giftCart ? "delete.gift.cart" : "use.gift.cart")}
          </Button>
        )}

        <Button
          onClick={handleButtonClick}
          color="black"
          fullWidth
          size="medium"
          loading={isLoading || isCalculating || isNavigating}
          disabled={
            isDisabled ||
            isCalculateError ||
            (calculateRes?.data ? !calculateRes?.data.status : false) ||
            (state.master?.id !== undefined &&
              state.unsupportedMastersByServices?.includes(state.master.id))
          }
        >
          {t("book.now")}
        </Button>
      </div>
      <Modal isOpen={isGiftCartModalOpen} onClose={closeGiftCartModal} withCloseButton>
        <GiftCartSelect onSelect={closeGiftCartModal} shopId={shopDetail?.data.id} />
      </Modal>
    </div>
  );
};

const ServiceTotalInfo: React.FC<{ service: BookingService; state: any }> = ({
  service = {} as BookingService,
  state,
}) => {
  const { t } = useTranslation();

  const selectedExtras =
    service.service_extras?.filter((extra) => service.selected_extra_ids?.includes(extra.id)) ?? [];

  return (
    <div key={service.id}>
      <div key={service.id} className="flex items-start justify-between py-4">
        <div>
          <p className="text-xl font-semibold">{service.translation?.title}</p>
          {selectedExtras?.map((extra) => (
            <p className="text-base font-medium">
              {t("extra")}: {extra?.translation?.title}
            </p>
          ))}

          <span className="text-base text-gray-field font-medium">
            {t("time")}: {service?.master?.service_master?.interval ?? service.interval}
            {t("min")}
          </span>
        </div>
        <div>
          <p className="text-xl font-semibold whitespace-nowrap">
            <Price
              number={
                service?.master?.service_master?.price ??
                service?.min_price ??
                service?.price ??
                service?.total_price ??
                0
              }
            />
          </p>
          {selectedExtras?.map((extra) => (
            <p className="text-base font-medium" key={extra.id}>
              <Price number={extra?.price ?? 0} />
            </p>
          ))}
          {/* {!!service?.selected_service_extra && ( */}
          {/*  <p className="text-base font-medium"> */}
          {/*    <Price number={service?.selected_service_extra?.price ?? 0} /> */}
          {/*  </p> */}
          {/* )} */}
        </div>
      </div>
      {!!service.master && !state.master && (
        <div className="flex items-center gap-1 mb-4">
          <div className="w-14 h-14 relative">
            <Image
              src={service.master?.img}
              alt={service.master?.firstname || "master"}
              className="rounded-full object-cover"
              fill
            />
          </div>
          <div>
            <p className="text-xl font-medium">
              {service.master?.firstname} {service.master?.lastname}
            </p>
            <span className="text-gray-field text-base font-semibold">{t("master")}</span>
          </div>
        </div>
      )}
    </div>
  );
};
