"use client";

import React, { useState } from "react";
import StarIcon from "@/assets/icons/star";
import Link from "next/link";
import dynamic from "next/dynamic";
import DiscountIcon from "@/assets/icons/discount";
import clsx from "clsx";
import { Stock } from "@/types/product";
import SwiperType from "swiper";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { Price } from "../price";
import { ProductLike } from "../product-like";
import { ProductCardUIProps } from "./types";
import { MediaRender } from "../media-render";

const ProductCounter = dynamic(() => import("./product-counter"));
const ProductCardGallery = dynamic(() => import("./product-card-gallery"));

const ProductCardUi5 = ({
  data,
  onIncrementProductCount,
  onDecrementProductCount,
  cartQuantity,
  params,
  gallery,
  onColorClick,
  selectedStock,
  isSame,
  roundedColors,
  cartDetailId,
}: ProductCardUIProps) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const handleColorClick = (stock: Stock, index: number) => {
    onColorClick(stock);
    if (swiper) {
      swiper.slideTo(index);
    }
  };
  const handleSlideChange = (slideIndex: number) => {
    if (gallery && gallery.length > 0) {
      onColorClick(gallery[slideIndex].stock);
    }
  };
  return (
    <div className="relative group bg-white dark:bg-darkBgUi3 rounded-xl overflow-hidden">
      {selectedStock?.discount && (
        <div className="absolute top-4 left-4 z-[2] text-red">
          <DiscountIcon />
        </div>
      )}
      <div className="absolute top-4 right-4 z-[2]">
        <ProductLike iconType="light" productId={data.id} />
      </div>
      <Link
        href={`/products/${data.uuid}${
          // eslint-disable-next-line no-nested-ternary
          params && params.length > 0
            ? `?${params}${selectedStock ? `&stock_id=${selectedStock.id}` : ""}`
            : selectedStock && swiper?.realIndex !== 0
            ? `?stock_id=${selectedStock.id}`
            : ""
        }`}
      >
        <div className="relative overflow-hidden aspect-[210/216] bg-gray-card">
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
          {settings?.product_ui_type === "2" && (
            <ProductCounter
              count={cartQuantity}
              onMinusClick={onDecrementProductCount}
              onPlusClick={onIncrementProductCount}
              minQty={data?.min_qty}
              interval={data?.interval}
              cartDetailId={cartDetailId}
              price={selectedStock?.total_price}
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
      >
        <div className="py-2.5 px-4 gap-1">
          <div className="flex items-center gap-2">
            <strong className="sm:text-xl text-sm font-semibold whitespace-nowrap">
              <Price number={selectedStock?.total_price} />
            </strong>
            {selectedStock?.discount && (
              <span className="text-gray-field text-sm font-semibold line-through whitespace-nowrap">
                <Price number={selectedStock?.price} />
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="md:text-base sm:text-sm text-xs font-medium line-clamp-2">
              {data.translation?.title}
            </span>
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="text-xs font-semibold">{data.r_avg || 0}</span>
              <div className="w-1 h-1 rounded-full bg-gray-field" />

              <span className="text-xs text-gray-field">
                {data.r_count || 0} {t("reviews")}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col flex-wrap px-4 pb-4">
        {gallery && gallery.length > 0 && (
          <div className="flex items-center gap-2 ">
            {gallery.map((galleryItem, index) =>
              galleryItem.color?.value ? (
                <button
                  key={galleryItem.img}
                  aria-label={galleryItem.color?.value}
                  onMouseEnter={() => handleColorClick(galleryItem.stock, index)}
                  onClick={() => handleColorClick(galleryItem.stock, index)}
                  style={{ backgroundColor: galleryItem.color?.value }}
                  className={clsx(
                    "w-4 h-4",
                    galleryItem.color?.value === "#ffffff" && "border border-gray-border",
                    roundedColors ? "rounded-full" : "rounded-md"
                  )}
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductCardUi5Loading = () => (
  <div className="relative">
    <div className="relative rounded-3xl bg-gray-300 overflow-hidden aspect-[210/280]" />
    <div className="flex items-center justify-between mt-4">
      <span className="h-4 rounded-full w-1/2" />
      <span className="h-3 rounded-full w-3/5" />
    </div>
  </div>
);

export default ProductCardUi5;
