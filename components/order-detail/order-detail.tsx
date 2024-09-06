import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { CartTotal } from "@/components/cart-total";
import { saveAs } from "file-saver";
import { error } from "@/components/alert";
import { useSettings } from "@/hook/use-settings";
import { OrderDetailCollapse } from "./order-detail-collapse";

const OrderDetail = ({ id, onRepeat }: { id?: number | null; onRepeat?: () => void }) => {
  const { t } = useTranslation();
  const [isDownLoading, setIsDownLoading] = useState(false);
  const { language } = useSettings();
  const { data } = useQuery(["order", id], () => orderService.get(id, { lang: language?.locale }), {
    suspense: true,
    enabled: !!id,
    refetchOnWindowFocus: true,
  });
  const orderDetail =
    data?.data?.find((orderItem) => typeof orderItem.parent_id === "undefined") || data?.data?.[0];
  const grandTotal = data?.data.reduce((acc, curr) => acc + curr.total_price, 0);

  const handleDownload = () => {
    setIsDownLoading(true);
    orderService
      .downloadInvoice(orderDetail?.id)
      .then(async (res) => {
        const stream = await res.blob();
        const blob = new Blob([stream], {
          type: "application/octet-stream",
        });
        const filename = "download.pdf";
        saveAs(blob, filename);
      })
      .catch(() => {
        error(t("cant.download.the.invoice"));
      })
      .finally(() => {
        setIsDownLoading(false);
      });
  };

  return (
    <div className="md:px-5 py-5 px-2">
      <div className="text-xl font-bold mt-2">
        #{data?.data ? data?.data.map((detail) => detail.id).join("-") : ""}
      </div>
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={!isDownLoading ? handleDownload : undefined}
            className="inline-flex items-center gap-2.5 text-sm text-blue-link"
          >
            {isDownLoading ? t("downloading...") : t("download.invoice")}
          </button>
        </div>
      </div>
      {data?.data.map((orderItem) => (
        <OrderDetailCollapse order={orderItem} onRepeat={onRepeat} />
      ))}
      {data?.data.length !== 1 && (
        <div className="mt-4">
          <CartTotal totals={{ total_price: grandTotal }} couponStyle={false} />
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
