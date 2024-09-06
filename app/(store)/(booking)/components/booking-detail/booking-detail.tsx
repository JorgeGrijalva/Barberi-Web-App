"use client";

import { Booking } from "@/types/booking";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { ImageWithFallBack } from "@/components/image";
import MapPinIcon from "@/assets/icons/map-pin";
import { Price } from "@/components/price";
import CrossIcon from "@/assets/icons/cross";
import ConfirmIcon from "@/assets/icons/confirm";
import clsx from "clsx";
import { useSettings } from "@/hook/use-settings";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking";
import { LoadingCard } from "@/components/loading";
import utc from "dayjs/plugin/utc";
import { BookingReview } from "@/app/(store)/(booking)/components/booking-review";
import { formService } from "@/services/form";
import dynamic from "next/dynamic";
import { BookingForm } from "@/types/booking-form";
import AppointmentNotes from "@/app/(store)/(booking)/components/notes/notes";
import { Button } from "@/components/button";
import { useExternalPayment } from "@/hook/use-external-payment";
import VerifiedIcon from "@/assets/icons/verified";
import DoubleCheck from "@/assets/icons/double-check";
import { BookingFormModal } from "./booking-form-modal";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

dayjs.extend(utc);

interface BookingDetailProps {
  data?: Booking[];
  id?: number;
}

export const BookingDetail = ({ data, id }: BookingDetailProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { mutate: createPaymentProcess, isLoading: isCreatingPaymentProcess } =
    useExternalPayment();
  const { data: bookingList, isLoading } = useQuery(
    ["appointment", id, language?.locale],
    () => bookingService.getById(id, { lang: language?.locale }),
    {
      enabled: !!id,
    }
  );
  const { data: forms } = useQuery(
    ["form", id, language?.locale, bookingList?.data.length],
    () =>
      formService.getForm({
        service_master_ids: bookingList?.data.map((item) => item.service_master_id),
        lang: language?.locale,
      }),
    {
      enabled: !!bookingList?.data && bookingList?.data.length !== 0,
    }
  );
  const handlePayButton = (currentDataItem: Booking) => {
    const body = {
      tag: currentDataItem?.transaction?.payment_system?.tag,
      data: {
        booking_id: currentDataItem?.parent_id || currentDataItem?.id,
      },
    };
    createPaymentProcess(body);
  };
  const mainData = !id ? data?.[0] : bookingList?.data?.[0];
  const currentData = !id ? data : bookingList?.data;
  // const totalCommissionFee = currentData?.reduce(
  //   (acc, curr) => acc + (curr.commission_fee ?? 0),
  //   0
  // );
  const totalCouponPrice = currentData?.reduce((acc, curr) => acc + (curr.coupon_price ?? 0), 0);
  const totalDiscount = currentData?.reduce((acc, curr) => acc + (curr.discount ?? 0), 0);
  const totalServiceFee = currentData?.reduce((acc, curr) => acc + (curr.service_fee ?? 0), 0);
  const totalExtraPrice = currentData?.reduce((acc, curr) => acc + (curr?.extra_price ?? 0), 0);
  const totalPrice = currentData?.reduce(
    (acc, curr) => acc + (curr?.total_price ?? curr?.total_price_by_parent ?? 0),
    0
  );
  const totalGiftCartPrice = currentData?.reduce(
    (acc, curr) => acc + (curr?.gift_cart_price ?? 0),
    0
  );
  if (isLoading && !!id) {
    return <LoadingCard />;
  }
  if (!id && !data) {
    return <Empty smallText text="select.booking" animated={false} />;
  }
  return (
    <div className="xl:py-10 py-7 xl:px-12 md:px-6 px-4">
      {!id && (
        <div className="flex flex-col items-center justify-center mb-8">
          {mainData?.status === "canceled" ? (
            <div className="flex items-center justify-center bg-red rounded-full text-white w-16 h-16">
              <CrossIcon />
            </div>
          ) : (
            <span className="text-primary">
              <ConfirmIcon />
            </span>
          )}
          <span
            className={clsx(
              "text-xl font-semibold",
              mainData?.status === "canceled" ? "text-red" : "text-primary"
            )}
          >
            {t(mainData?.status || "")}
          </span>
        </div>
      )}
      <p className="md:text-2xl text-[22px] font-semibold mb-3">#{mainData?.id}</p>
      <p className="md:text-2xl text-[22px] font-semibold">
        {dayjs.utc(mainData?.start_date).format("DD MMM YYYY")} {t("at")}{" "}
        {dayjs.utc(mainData?.start_date).format("HH:mm")}
      </p>

      <div className="flex items-center gap-4 border-b border-gray-link pb-5 mt-4">
        <div className="w-14 h-14 relative rounded-full border border-gray-link aspect-square ">
          <ImageWithFallBack
            src={mainData?.shop?.logo_img || ""}
            alt={mainData?.shop?.translation?.title || "shop"}
            fill
            className="object-contain rounded-full w-20 h-20"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={clsx("text-xl font-medium ", mainData?.shop?.verify && "line-clamp-1")}>
              {mainData?.shop?.translation?.title}
            </h2>
            {mainData?.shop?.verify && (
              <span>
                <VerifiedIcon />
              </span>
            )}
          </div>
          <div className="flex items-start gap-1">
            <MapPinIcon />
            <p className="text-sm line-clamp-2">{mainData?.shop?.translation?.address}</p>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <strong className="text-2xl font-semibold">{t("details")}</strong>
        {currentData?.map((item) => {
          const form = item.data?.form
            ? item.data.form.find(
                (formItem: BookingForm) => formItem?.service_master_id === item.service_master_id
              )
            : forms?.data.find(
                (formItem) => formItem?.service_master_id === item.service_master_id
              );
          return (
            <div key={item.id}>
              <div className="flex  justify-between py-4">
                <div className="flex flex-col">
                  <p className="text-xl font-semibold">
                    {item?.service_master?.service?.translation?.title}
                  </p>
                  {!!item?.extras?.length &&
                    item?.extras?.map((extra) => (
                      <p className="text-base font-medium" key={extra?.id}>
                        {extra?.translation?.title}
                      </p>
                    ))}
                  <span className="text-base text-gray-field font-medium">
                    {t("time")}: {item?.service_master?.interval}
                    {t("min")}
                  </span>
                  <span className="text-base text-gray-field font-medium">
                    {t("status")}: {t(item.status)}
                  </span>
                  <span className="text-base text-gray-field font-medium">
                    {t("bookings.id")}: {item.id}
                  </span>
                  {item?.user_member_ship && (
                    <div className="flex gap-2 items-center text-base text-gray-field font-medium">
                      {t("membership")}:
                      <span className="text-green">
                        <DoubleCheck />
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    <Price
                      number={!item?.user_member_ship ? item?.price : item?.total_price}
                      customCurrency={mainData?.currency}
                    />
                  </p>
                  {!!item?.extras?.length &&
                    item.extras.map((extra) => (
                      <p className="text-base font-medium">
                        <Price number={extra.price} />
                      </p>
                    ))}
                </div>
              </div>
              {item.status === "ended" && (
                <BookingReview
                  service={item.service_master?.service}
                  bookingId={item.id}
                  bookingParentId={mainData?.id}
                  initialData={item.review}
                />
              )}
              <BookingFormModal booking={item} form={form} allForms={forms} parentId={id} />
            </div>
          );
        })}
      </div>
      <div className="py-7 text-xl font-semibold  border-t border-gray-link">
        <AppointmentNotes id={id} data={bookingList?.data} />
      </div>
      {!!totalCouponPrice && (
        <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link">
          <span>{t("coupon")}</span>
          <span>
            <Price number={totalCouponPrice} customCurrency={mainData?.currency} />
          </span>
        </div>
      )}
      <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link">
        <span>{t("discount")}</span>
        <span>
          <Price number={totalDiscount} customCurrency={mainData?.currency} />
        </span>
      </div>
      {!!totalGiftCartPrice && (
        <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link">
          <span>{t("gift.cart")}</span>
          <span>
            <Price number={totalGiftCartPrice} customCurrency={mainData?.currency} />
          </span>
        </div>
      )}
      {/* <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link"> */}
      {/*  <span>{t("commission.fee")}</span> */}
      {/*  <span> */}
      {/*    <Price number={totalCommissionFee} customCurrency={mainData?.currency} /> */}
      {/*  </span> */}
      {/* </div> */}
      <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link">
        <span>{t("service.fee")}</span>
        <span>
          <Price number={totalServiceFee} customCurrency={mainData?.currency} />
        </span>
      </div>
      <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link">
        <span>{t("extras.price")}</span>
        <span>
          <Price number={totalExtraPrice} />
        </span>
      </div>
      <div className="flex items-center justify-between py-7 text-[26px] font-semibold border-b border-t border-gray-link">
        <span>{t("total")}</span>
        <span>
          <Price number={totalPrice} customCurrency={mainData?.currency} />
        </span>
      </div>
      {currentData?.[0]?.transaction?.payment_system?.tag !== "cash" &&
        currentData?.[0]?.transaction?.status === "progress" && (
          <div className="py-7 text-[26px] font-semibold border-b border-t border-gray-link">
            <Button
              fullWidth
              loading={isCreatingPaymentProcess}
              onClick={() => handlePayButton(currentData?.[0])}
            >
              {t("pay")}
            </Button>
          </div>
        )}
      <div className="py-3">
        <strong className="text-2xl font-semibold mt-3">{t("reschedule.policy")}</strong>
        <p className="text-base">{t("reschedule.policy.description")}</p>
      </div>
      <div className="pt-3">
        <strong className="text-2xl font-semibold mt-3">{t("cancellation.policy")}</strong>
        <p className="text-base">{t("cancellation.policy.description")}</p>
      </div>
    </div>
  );
};
