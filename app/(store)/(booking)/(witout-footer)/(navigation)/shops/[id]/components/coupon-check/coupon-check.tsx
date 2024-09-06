"use client";

import { Input } from "@/components/input";
import { useTranslation } from "react-i18next";
import CouponIcon from "@/assets/icons/coupon";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hook/use-debounce";
import { useMutation } from "@tanstack/react-query";
import CrossIcon from "@/assets/icons/cross";
import DoubleCheck from "@/assets/icons/double-check";
import { Coupon } from "@/types/product";
import { bookingService } from "@/services/booking";
import { error } from "@/components/alert";
import NetworkError from "@/utils/network-error";

interface BookingCouponCheckProps {
  onCouponCheckSuccess: (coupon: Coupon) => void;
  onCouponCheckError: () => void;
  shopId?: number;
  defaultValue?: string;
}

export const BookingCouponCheck = ({
  onCouponCheckSuccess,
  onCouponCheckError,
  shopId,
  defaultValue,
}: BookingCouponCheckProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(true);
  const debouncedValue = useDebounce(value);
  const {
    mutate: check,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (body: string) => bookingService.checkCoupon({ coupon: body, shop_id: shopId }),
    onSuccess: (res) => {
      if (res.data?.for === "booking_total_price") {
        onCouponCheckSuccess(res.data);
        setIsValidCoupon(true);
      } else {
        onCouponCheckError();
        setIsValidCoupon(false);
      }
    },
    onError: (err: NetworkError) => {
      error(err?.message);
      onCouponCheckError();
    },
    cacheTime: 0,
  });

  useEffect(() => {
    if (debouncedValue && debouncedValue.length >= 0) {
      check(debouncedValue);
    } else {
      onCouponCheckError();
    }
  }, [debouncedValue]);
  const getIcon = () => {
    if (debouncedValue && debouncedValue.length > 0) {
      if (isError || !isValidCoupon) {
        return (
          <span className="text-red">
            <CrossIcon />
          </span>
        );
      }
      if (isSuccess) {
        return (
          <span className="text-green">
            <DoubleCheck />
          </span>
        );
      }
    }
    return null;
  };

  return (
    <Input
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      leftIcon={<CouponIcon />}
      fullWidth
      rightIcon={getIcon()}
      label={t("coupon")}
    />
  );
};
