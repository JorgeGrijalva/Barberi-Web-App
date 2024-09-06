"use client";

import { Input } from "@/components/input";
import { useTranslation } from "react-i18next";
import CouponIcon from "@/assets/icons/coupon";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hook/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import CrossIcon from "@/assets/icons/cross";
import DoubleCheck from "@/assets/icons/double-check";
import { Coupon } from "@/types/product";
import { error } from "@/components/alert";
import NetworkError from "@/utils/network-error";

interface CouponCheckProps {
  onCouponCheckSuccess: (coupon: Coupon) => void;
  onCouponCheckError: () => void;
  onCouponDelete: () => void;
  shopId?: number;
}

export const CouponCheck = ({
  onCouponCheckSuccess,
  onCouponCheckError,
  onCouponDelete,
  shopId,
}: CouponCheckProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | undefined>();
  const [isCouponValid, setIsCouponValid] = useState<boolean>(true);
  const debouncedValue = useDebounce(value);
  const {
    mutate: check,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (body: string) => orderService.checkCoupon({ coupon: body, shop_id: shopId }),
    onSuccess: (res) => {
      if (res.data?.for === "total_price" || res.data?.for === "delivery_fee") {
        onCouponCheckSuccess(res.data);
        setIsCouponValid(true);
      } else {
        onCouponCheckError();
        setIsCouponValid(false);
      }
    },
    onError: (err: NetworkError) => {
      onCouponCheckError();
      error(err?.message);
    },
  });
  useEffect(() => {
    if (debouncedValue && debouncedValue.length >= 0) {
      check(debouncedValue);
    } else {
      onCouponDelete();
    }
  }, [debouncedValue]);
  let icon = null;
  if (value && value.length < 1) {
    icon = null;
  } else if ((isError || !isCouponValid) && debouncedValue && debouncedValue.length > 0) {
    icon = (
      <span className="text-red">
        <CrossIcon />
      </span>
    );
  } else if (isSuccess && debouncedValue && debouncedValue.length > 0) {
    icon = (
      <span className="text-green">
        <DoubleCheck />
      </span>
    );
  }
  return (
    <Input
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      leftIcon={<CouponIcon />}
      fullWidth
      rightIcon={icon}
      label={t("coupon")}
    />
  );
};
