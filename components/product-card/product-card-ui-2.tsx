"use client";

import React, { useState } from "react";
import StarIcon from "@/assets/icons/star";
import Link from "next/link";
import DiscountIcon from "@/assets/icons/discount";

import SwiperType from "swiper";
import { Stock } from "@/types/product";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { ImageWithFallBack } from "@/components/image";
import { useSettings } from "@/hook/use-settings";
import { ProductCardUIProps } from "./types";
import { ProductLike } from "../product-like";
import { Price } from "../price";
import { Translate } from "../translate";
import ProductCounter from "./product-counter";

const ProductCardGallery = dynamic(() => import("./product-card-gallery"));

const ProductCardUi2 = ({
  data,
  onIncrementProductCount,
  onDecrementProductCount,
  cartQuantity,
  params,
  gallery,
  onColorClick,
  selectedStock,
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
    <div className="flex items-center gap-7 group">
      <div className="relative overflow-hidden rounded-3xl h-full aspect-[210/250] max-h-[250px]">
        {gallery && gallery.length > 0 ? (
          <ProductCardGallery
            gallery={gallery}
            onSwiper={(value) => setSwiper(value)}
            onSlideChange={handleSlideChange}
          />
        ) : (
          <ImageWithFallBack
            src={data.img}
            alt={data.translation?.title || "product"}
            fill
            className="object-contain block transition-all group-hover:brightness-110"
          />
        )}
        {data.stocks[0]?.discount && (
          <div className="absolute top-4 left-4 z-[2] text-red">
            <DiscountIcon />
          </div>
        )}
        <div className="absolute z-[2] right-4 top-4">
          <ProductLike productId={data.id} />
        </div>
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
      <Link
        href={`/products/${data.uuid}${
          // eslint-disable-next-line no-nested-ternary
          params && params.length > 0
            ? `?${params}${selectedStock ? `&stock_id=${selectedStock.id}` : ""}`
            : selectedStock && swiper?.realIndex !== 0
            ? `?stock_id=${selectedStock.id}`
            : ""
        }`}
        className="flex-1 my-5"
      >
        <div className="md:text-[22px] text-lg font-medium line-clamp-1">
          {data.translation?.title}
        </div>
        <span className="md:text-base text-xs text-gray-field line-clamp-2 mt-3 h-12">
          {data.translation?.description}
        </span>
        <div className="flex items-center gap-3 mt-[18px]">
          <span className="md:text-base text-xs font-medium">
            <Translate value="reviews" /> ({data.r_count || 0})
          </span>
          <div className="flex items-center gap-1">
            <StarIcon />
            <span className="text-base font-semibold">{data.r_avg || 0}</span>
          </div>
        </div>
        <div className="text-xs font-medium mt-[14px] mb-7">
          {t("sku")}: {selectedStock.sku}
        </div>
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <strong className="text-xl font-semibold">
              <Price number={selectedStock?.total_price} />
            </strong>
            {selectedStock?.discount && (
              <span className="text-primary text-sm font-semibold line-through">
                <Price number={selectedStock?.price} />
              </span>
            )}
          </div>
          {gallery && gallery.length > 0 && (
            <div className="flex items-center gap-2">
              {gallery.map((galleryItem, index) => (
                <button
                  key={galleryItem.img}
                  aria-label={galleryItem.color?.value}
                  onMouseEnter={() => handleColorClick(galleryItem.stock, index)}
                  onClick={() => handleColorClick(galleryItem.stock, index)}
                  style={{ backgroundColor: galleryItem.color?.value }}
                  className={clsx(
                    "w-4 h-4 rounded-md",
                    galleryItem.color?.value === "#ffffff" && "border border-gray-border"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export const ProductCardUi2Loading = () => (
  <div className="flex gap-7 animate-pulse">
    <div className="relative overflow-hidden rounded-3xl h-[250px] aspect-[210/250] bg-gray-300" />
    <div className="flex-1 my-5">
      <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
      <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
      <div className="h-4 mt-3 rounded-full bg-gray-300 w-3/5" />
    </div>
  </div>
);

export default ProductCardUi2;
