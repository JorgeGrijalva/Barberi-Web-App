import clsx from "clsx";
import Image from "next/image";
import { CheckoutProduct } from "@/components/checkout-product";
import React from "react";
import { OrderFull } from "@/types/order";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import CheckDoubleFillIcon from "remixicon-react/CheckDoubleFillIcon";
import ListCheck2LineIcon from "remixicon-react/ListCheck2Icon";
import RunFillIcon from "remixicon-react/RunFillIcon";
import FlagFillIcon from "remixicon-react/FlagFillIcon";
import CrossIcon from "@/assets/icons/cross";
import dayjs from "dayjs";
import { ProfilePlaceholder } from "@/components/profile-placeholder";
import { IconButton } from "@/components/icon-button";
import PhoneFillIcon from "remixicon-react/PhoneFillIcon";
import Chat1FillIcon from "remixicon-react/Chat1FillIcon";
import MapPinRangeLineIcon from "remixicon-react/MapPinRangeLineIcon";
import { CartTotal } from "@/components/cart-total";
import { Button } from "@/components/button";
import { ConfirmModal } from "@/components/confirm-modal";
import { Modal } from "@/components/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertCartPayload } from "@/types/cart";
import { cartService } from "@/services/cart";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";
import { orderService } from "@/services/order";
import { useRouter } from "next/navigation";
import { LoadingCard } from "@/components/loading";
import useAddressStore from "@/global-store/address";
import { useModal } from "@/hook/use-modal";
import { ExpandableShop } from "@/components/expandable-shop";
import TruckFillIcon from "remixicon-react/TruckFillIcon";
import DirectionLineIcon from "remixicon-react/DirectionLineIcon";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import { useSettings } from "@/hook/use-settings";

const OrderAddress = dynamic(() =>
  import("./order-address").then((component) => ({ default: component.OrderAddress }))
);
const OrderRefund = dynamic(() =>
  import("./order-refund").then((component) => ({ default: component.OrderRefund }))
);
const DeliverymanReview = dynamic(
  () =>
    import("./deliveryman-review").then((component) => ({ default: component.DeliverymanReview })),
  {
    loading: () => <LoadingCard />,
  }
);

const orderProgress: Record<string, { step: number; icon: React.ReactElement }> = {
  new: {
    step: 1,
    icon: <CheckDoubleFillIcon />,
  },
  accepted: {
    step: 1,
    icon: <CheckDoubleFillIcon />,
  },
  ready: {
    step: 2,
    icon: <ListCheck2LineIcon />,
  },
  pause: {
    step: 2,
    icon: <ListCheck2LineIcon />,
  },
  on_a_way: {
    step: 3,
    icon: <RunFillIcon />,
  },
  delivered: {
    step: 4,
    icon: <FlagFillIcon />,
  },
  canceled: {
    step: 0,
    icon: <CrossIcon />,
  },
};

const statuses = Object.keys(orderProgress).reverse();

interface OrderDetailCollapseProps {
  order: OrderFull;
  onRepeat?: () => void;
}

export const OrderDetailCollapse = ({ order, onRepeat }: OrderDetailCollapseProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const router = useRouter();
  const { currency, language } = useSettings();
  const [isAddressModalOpen, openAddressModal, closeAddressModal] = useModal();
  const [confirmModalOpen, openConfirmModal, closeConfirmModal] = useModal();
  const [reviewModalOpen, openReviewModal, closeReviewModal] = useModal();
  const { mutate: insertProductToServerCart, isLoading: isInserting } = useMutation({
    mutationFn: (body: InsertCartPayload) => cartService.insert(body),
    onError: (err: NetworkError) => error(err.message),
  });
  const { mutate: cancelOrder, isLoading: isCanceling } = useMutation({
    mutationFn: (orderId: number) => orderService.cancel(orderId),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: () => {
      closeConfirmModal();
      queryClient.invalidateQueries(["order", order.parent_id || order.id]);
      queryClient.invalidateQueries(["activeOrders"]);
    },
  });

  const handleCancelOrder = () => {
    cancelOrder(order.id);
  };
  const canRefund = !order.order_refunds?.some(
    (item) => item.status === "accepted" || item.status === "pending"
  );

  const handleRepeatOrder = () => {
    if (currency && country) {
      const products: { stock_id: number; quantity: number }[] = [];
      order?.details.forEach((product) => {
        if (!product.bonus) {
          products.push({
            stock_id: product.stock.id,
            quantity: product.quantity,
          });
        }
      });
      insertProductToServerCart(
        {
          currency_id: currency.id,
          rate: currency.rate,
          products,
          region_id: country?.region_id,
          country_id: country?.id,
          city_id: city?.id,
        },
        {
          onSuccess: () => {
            success(t("successfully.added"));
            router.back();
            if (onRepeat) {
              setTimeout(() => {
                onRepeat();
              }, 1);
            }
          },
        }
      );
    }
  };

  const handleCloseReviewModal = () => {
    closeReviewModal();
  };

  const progress = order ? statuses.findIndex((item) => item === order.status) : 0;

  return (
    <ExpandableShop
      extra={
        <span className="text-sm ">
          {t("order.id")}: #{order?.id}
        </span>
      }
      shop={order?.shop}
      defaultOpen={order.details.length !== 0}
      showEstimatedTime
    >
      <section className="items-center py-4">
        {statuses.map((status, index) => {
          const note = order.notes.find((item) => item.status === status);

          if (status === "canceled" && order.status !== "canceled") return null;
          return (
            <div key={status} className={clsx("relative flex gap-2 justify-between")}>
              <div className="flex flex-col items-center">
                <div>
                  <div
                    className={clsx(
                      "flex items-center justify-center w-6 h-6 bg-opacity-30 rounded-full",
                      progress <= index && "bg-green",
                      progress > index && "bg-gray-inputBorder",
                      order.status === "canceled" && "bg-red"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-3 h-3 rounded-full",
                        progress <= index && "bg-green",
                        progress > index && "bg-gray-inputBorder",
                        order.status === "canceled" && "bg-red"
                      )}
                    />
                  </div>
                </div>
                <div
                  className={clsx(
                    "w-px h-full",
                    progress <= index && "bg-green",
                    progress > index && "bg-gray-inputBorder",
                    order.status === "canceled" && "bg-red"
                  )}
                />
              </div>
              <div className={clsx("flex-1", index !== statuses.length - 1 && "pb-4")}>
                <Disclosure defaultOpen={!!note?.notes}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        as={note ? "button" : "div"}
                        className="flex w-full justify-between rounded-lg bg-gray-faq px-4 py-2 text-left text-base font-medium  hover:bg-gray-inputBorder focus:outline-none focus-visible:ring focus-visible:ring-green ring-opacity-30 dark:bg-white dark:bg-opacity-20 dark:hover:bg-gray-inputBorder"
                      >
                        <span>{t(status)}</span>
                        <div className="flex items-center gap-1">
                          {((progress <= index && note?.updated_at) ||
                            (order.status === "new" && status === "new")) && (
                            <span className="text-xs text-gray-field">
                              {dayjs(
                                order.status === "new" ? order.created_at : note?.updated_at
                              ).format("DD MMM, YYYY HH:mm")}
                            </span>
                          )}
                          {!!note?.notes && (
                            <AnchorDownIcon
                              className={clsx(open && "rotate-180 transform", "h-5 w-5")}
                            />
                          )}
                        </div>
                      </Disclosure.Button>
                      {note && !!note.notes && (
                        <Disclosure.Panel
                          className="pb-2 pt-4 text-sm list-disc list-inside flex flex-col gap-1"
                          as="ul"
                        >
                          {note.notes?.map((noteItem) =>
                            noteItem.title ? (
                              <li className="flex gap-1" key={noteItem.created_at}>
                                <div>
                                  <div className="w-1 h-1 rounded-full bg-dark dark:bg-white mt-2" />
                                </div>
                                <div className="flex flex-col">
                                  <strong className="text-base font-medium">
                                    {noteItem?.title?.[language?.locale || ""] || ""}
                                  </strong>
                                  <span className="text-xs text-gray-field">
                                    {dayjs(noteItem.created_at).format("DD MMM, YYYY HH:mm")}
                                  </span>
                                </div>
                              </li>
                            ) : null
                          )}
                        </Disclosure.Panel>
                      )}
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
          );
        })}
      </section>
      {order?.deliveryman && (
        <div className=" mt-4">
          {order.status === "delivered" && (
            <div className="flex justify-end">
              <button onClick={openReviewModal} className="text-blue-link text-sm my-1">
                {t("add.review")}
              </button>
            </div>
          )}
          <div className="p-2.5 bg-white bg-opacity-30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {order?.deliveryman.img ? (
                <Image
                  width={50}
                  height={50}
                  className="rounded-full aspect-square object-cover"
                  src={order?.deliveryman.img}
                  alt={order?.deliveryman?.firstname || "deliveryman"}
                />
              ) : (
                <ProfilePlaceholder size={50} name={order?.deliveryman?.firstname} />
              )}
              <div>
                <div className="text-lg font-semibold">
                  {order?.deliveryman.firstname} {order?.deliveryman.lastname}
                </div>
                <span className="text-gray-field">{t("driver")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={`tel:${order?.deliveryman.phone}`}>
                <IconButton color="black" size="large" rounded>
                  <PhoneFillIcon />
                </IconButton>
              </a>
              <a href={`sms:${order?.deliveryman.phone}`}>
                <IconButton color="primary" size="large" rounded>
                  <Chat1FillIcon />
                </IconButton>
              </a>
            </div>
          </div>
        </div>
      )}
      {(!!order?.track_id || !!order?.track_name) && (
        <div className="px-2.5 py-4  bg-white bg-opacity-30 rounded-2xl  my-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 aspect-square dark:text-white rounded-full text-dark flex items-center justify-center">
              <TruckFillIcon />
            </div>
            <div className="text-start">
              <div className="text-sm font-semibold">{order?.track_name}</div>
              <span className="text-xs line-clamp-1">
                {t("tracking.id")}: {order?.track_id}
              </span>
            </div>
          </div>
          {!!order?.track_url && (
            <Link
              href={order.track_url}
              target="_blank"
              className="w-10 h-10 aspect-square text-white bg-dark rounded-full  flex items-center justify-center"
            >
              <DirectionLineIcon />
            </Link>
          )}
        </div>
      )}
      {(!!order?.my_address || !!order?.delivery_point) && (
        <button
          onClick={() => openAddressModal()}
          className="px-2.5 py-4  bg-white bg-opacity-30 rounded-2xl flex items-center gap-2.5 my-4 w-full"
        >
          <div className="w-10 h-10 aspect-square text-white rounded-full bg-dark flex items-center justify-center">
            <MapPinRangeLineIcon />
          </div>
          <div className="text-start">
            <div className="text-sm font-semibold">
              {order?.my_address ? t("delivery.location") : t("delivery.point")}
            </div>
            <span className="text-xs line-clamp-1">
              {order?.my_address
                ? order.my_address.location?.address
                : order.delivery_point?.address?.[language?.locale || ""]}
            </span>
          </div>
        </button>
      )}
      <div className="flex items-center justify-between mt-10">
        <div className="text-base font-semibold">{t("your.order")}</div>
        {order?.status === "delivered" && canRefund && <OrderRefund orderId={order?.id} />}
      </div>
      <div className="my-5 flex flex-col gap-4 mb-3">
        {order?.details.map((product) => (
          <CheckoutProduct data={product} key={product.id} />
        ))}
      </div>
      <span className="text-sm italic">{order?.note}</span>
      <CartTotal
        couponStyle={false}
        totals={{
          total_price: order?.total_price,
          price: order?.origin_price,
          total_shop_tax: order?.tax,
          total_discount: order?.total_discount,
          delivery_fee: order?.delivery_fee,
          service_fee: order?.service_fee,
          total_coupon_price: order?.coupon?.price,
        }}
      />
      {order?.status === "new" && (
        <Button
          className="mt-2"
          color="black"
          loading={isCanceling}
          onClick={openConfirmModal}
          fullWidth
        >
          {t("cancel")}
        </Button>
      )}
      {(order?.status === "delivered" || order?.status === "canceled") && (
        <div className="flex items-center mt-2 gap-2">
          <Button as="a" href={`tel:${order.user.phone}`} color="black" fullWidth>
            {t("support")}
          </Button>
          <Button onClick={handleRepeatOrder} loading={isInserting} fullWidth>
            {t("repeat.order")}
          </Button>
        </div>
      )}
      <ConfirmModal
        text="are.you.sure.want.to.cancel"
        onCancel={closeConfirmModal}
        onConfirm={handleCancelOrder}
        isOpen={confirmModalOpen}
        loading={isCanceling}
      />
      <Modal isOpen={isAddressModalOpen} withCloseButton onClose={closeAddressModal}>
        <div className="p-5">
          <div className=" mb-4 rtl:text-right">
            <span className="text-xl font-semibold">
              {order?.my_address ? t("delivery.location") : t("delivery.point")}
            </span>
          </div>
          <OrderAddress
            location={
              order?.my_address
                ? {
                    lat: Number(order.my_address.location?.latitude),
                    lng: Number(order.my_address.location?.longitude),
                  }
                : {
                    lat: Number(order?.delivery_point?.location.latitude),
                    lng: Number(order?.delivery_point?.location.longitude),
                  }
            }
          />
        </div>
      </Modal>
      <Modal isOpen={reviewModalOpen} withCloseButton onClose={handleCloseReviewModal}>
        <div className="md:px-5 py-5 px-2">
          <div className=" mb-4 rtl:text-right">
            <span className="text-xl font-semibold">{t("deliveryman.review")}</span>
          </div>
          {!!order && <DeliverymanReview onSuccess={handleCloseReviewModal} id={order.id} />}
        </div>
      </Modal>
    </ExpandableShop>
  );
};
