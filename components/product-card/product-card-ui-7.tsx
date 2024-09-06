"use client";

import React, { useState } from "react";
import StarIcon from "@/assets/icons/star";
import Link from "next/link";
import dynamic from "next/dynamic";
import DiscountIcon from "@/assets/icons/discount";
import SwiperType from "swiper";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { Price } from "../price";
import { ProductCardUIProps } from "./types";
import { MediaRender } from "../media-render";

const ProductCounter = dynamic(() => import("./product-counter-ui-2"));
const ProductCardGallery = dynamic(() => import("./product-card-gallery"));

const ProductCardUi7 = ({
  data,
  onIncrementProductCount,
  onDecrementProductCount,
  cartQuantity,
  params,
  gallery,
  onColorClick,
  selectedStock,
  isSame,
  cartDetailId,
}: ProductCardUIProps) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const handleSlideChange = (slideIndex: number) => {
    if (gallery && gallery.length > 0) {
      onColorClick(gallery[slideIndex].stock);
    }
  };
  return (
    <div className="relative group flex gap-5">
      {selectedStock?.discount && (
        <div className="absolute top-4 left-4 z-[2] text-red">
          <DiscountIcon />
        </div>
      )}
      <Link
        href={`/products/${data.uuid}${
          // eslint-disable-next-line no-nested-ternary
          params && params.length > 0
            ? `?${params}${selectedStock ? `&stock_id=${selectedStock.id}` : ""}`
            : selectedStock && swiper?.realIndex !== 0
            ? `?stock_id=${selectedStock.id}`
            : ""
        }`}
        className="aspect-square md:max-w-[130px] max-w-[130px] bg-gray-card rounded-lg w-full h-full"
      >
        <div className="relative overflow-hidden  w-full h-full">
          {gallery && gallery.length > 0 ? (
            <ProductCardGallery
              gallery={gallery}
              onSwiper={(value) => setSwiper(value)}
              onSlideChange={handleSlideChange}
            />
          ) : (
            <MediaRender
              preview={data.galleries?.[0].preview}
              src={data.img}
              alt={data.translation?.title || "product"}
              fill
              className="object-contain transition-all group-hover:brightness-110"
            />
          )}
        </div>
      </Link>
      <Link
        onClick={(e) => {
          if (isSame) {
            e.preventDefault();
          }
        }}
        href={`/products/${data.uuid}${
          // eslint-disable-next-line no-nested-ternary
          params && params.length > 0
            ? `?${params}${selectedStock ? `&stock_id=${selectedStock.id}` : ""}`
            : selectedStock && swiper?.realIndex !== 0
            ? `?stock_id=${selectedStock.id}`
            : ""
        }`}
        className="flex-1"
      >
        <div className="py-2.5 gap-1">
          <span className="sm:text-sm text-xs font-medium line-clamp-2">
            {data.translation?.title}
          </span>
          <div className="flex items-center gap-1 my-2">
            <StarIcon />
            <span className="text-xs font-semibold">{data.r_avg || 0}</span>
            <div className="w-1 h-1 rounded-full bg-gray-field" />

            <span className="text-xs text-gray-field">
              {data.r_count || 0} {t("reviews")}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              <strong className="sm:text-xl text-sm font-semibold whitespace-nowrap">
                <Price number={selectedStock?.total_price} />
              </strong>
              {selectedStock?.discount && (
                <span className="text-gray-field text-sm line-through whitespace-nowrap">
                  <Price number={selectedStock?.price} />
                </span>
              )}
            </div>
            {settings?.product_ui_type === "2" && (
              <ProductCounter
                count={cartQuantity}
                onMinusClick={onDecrementProductCount}
                onPlusClick={onIncrementProductCount}
                minQty={data?.min_qty}
                interval={data?.interval}
                cartDetailId={cartDetailId}
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export const ProductCardUi7Loading = () => (
  <div className="flex gap-7 animate-pulse">
    <div className="relative overflow-hidden h-[130px] rounded-lg aspect-square bg-gray-300" />
    <div className="flex-1 my-5">
      <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
      <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
      <div className="h-4 mt-4 rounded-full bg-gray-300 w-3/5" />
    </div>
  </div>
);

export default ProductCardUi7;
