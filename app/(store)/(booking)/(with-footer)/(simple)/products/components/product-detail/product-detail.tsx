"use client";

import { ExtraValue, ProductExpandedGallery, ProductFull, Stock } from "@/types/product";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import StoreIcon from "@/assets/icons/store";
import StarIcon from "@/assets/icons/star";
import GreenCheckIcon from "@/assets/icons/green-check";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Price } from "@/components/price";
import DiscountIcon from "@/assets/icons/discount";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { unitify } from "@/utils/unitify";
import useSettingsStore from "@/global-store/settings";
import useUserStore from "@/global-store/user";
import { DefaultResponse } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import useAddressStore from "@/global-store/address";
import VerifiedIcon from "@/assets/icons/verified";

interface ProductDetailProps {
  initialData?: DefaultResponse<ProductFull>;
  fullPage?: boolean;
}

const ProductList = dynamic(
  () =>
    import("@/components/slidable-product-list").then((component) => ({
      default: component.SlidableProductList,
    })),
  {
    ssr: false,
  }
);

const ReviewSummary = dynamic(
  () => import("@/app/(store)/(booking)/components/reviews/review-summary-short")
);
const SuggestionList = dynamic(() => import("../suggestion"));
const CreateReview = dynamic(() => import("./product-review-create"));
const ReviewList = dynamic(() => import("@/app/(store)/(booking)/components/reviews/review-list"));
const ProductStock = dynamic(() => import("./product-stock"), { ssr: false });
const ProductGallery = dynamic(
  () => import("./product-gallery").then((component) => ({ default: component.ProductGallery })),
  {
    ssr: false,
    loading: () => (
      <div className=" flex gap-10 aspect-[690/724] w-full max-h-[724px] ">
        <div className="rounded-2xl bg-gray-300 h-full flex-1" />
        <div className="flex flex-col gap-2  w-16 overflow-y-auto flex-wrap">
          {Array.from(Array(10).keys()).map((item) => (
            <div className="w-full aspect-square rounded-2xl bg-gray-300" key={item} />
          ))}
        </div>
      </div>
    ),
  }
);
const ProductGalleryModal = dynamic(
  () =>
    import("./product-gallery-modal").then((component) => ({
      default: component.ProductGalleryModal,
    })),
  {
    ssr: false,
    loading: () => <div className="rounded-2xl md:aspect-[411/609] aspect-[1/1.15] bg-gray-300" />,
  }
);
const ProductActions = dynamic(
  () => import("./product-actions").then((component) => ({ default: component.ProductActions })),
  { ssr: false }
);
const ProductCompareNotifier = dynamic(() => import("./product-compare-notifier"));
const ProductStickyInfo = dynamic(() =>
  import("../product-sticky-info").then((component) => ({ default: component.ProductStickyInfo }))
);

export const ProductDetail = ({ initialData, fullPage }: ProductDetailProps) => {
  const user = useUserStore((state) => state.user);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const { data: productDetail } = useQuery(
    ["product", initialData?.data.id, language?.locale, currency?.id],
    () =>
      productService.get(initialData?.data.uuid, {
        lang: language?.locale,
        currency_id: currency?.id,
        region_id: country?.region_id,
      }),
    {
      initialData,
    }
  );
  const data = productDetail?.data;
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const defaultStock =
    data?.stocks.find((stock) => stock.id === Number(searchParams.get("stock_id"))) ||
    data?.stocks?.[0];
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>(defaultStock);
  const defaultColor = defaultStock?.extras?.find((extra) => extra?.group?.type === "color")?.value;
  const [selectedColor, setSelectedColor] = useState<ExtraValue | undefined>(defaultColor);
  const [showProductStickyInfo, setShowProductStickyInfo] = useState(false);
  const halfProperties = data?.properties.slice(0, Math.floor(data.properties.length / 2));
  const secondHalfProperties = data?.properties.slice(Math.floor(data.properties.length / 2));
  const galleries = useMemo(() => {
    const tempGalleries: ProductExpandedGallery[] = [];
    data?.galleries.forEach((gallery) => {
      tempGalleries.push({
        stock: data?.stocks?.[0],
        img: gallery.path,
        preview: gallery.preview,
      });
    });
    data?.stocks.forEach((stock) => {
      const color = stock.extras.find((extra) => extra.group.type === "color")?.value;

      if (stock.galleries && stock.galleries.length > 0 && color) {
        stock.galleries.forEach((gallery) => {
          tempGalleries.push({
            stock,
            img: gallery.path,
            color,
            preview: gallery.preview,
          });
        });
      }
    });
    return tempGalleries;
  }, [data]);

  return (
    <div className="pb-10 md:pb-0">
      {fullPage && <ProductCompareNotifier id={data?.id} />}
      {showProductStickyInfo && <ProductStickyInfo data={data} selectedStock={selectedStock} />}
      <div
        className={clsx(fullPage ? "xl:container px-4 pb-5" : "pt-10 sm:pt-5 px-4 sm:px-5 pb-5 ")}
      >
        <div
          className={clsx(
            "grid lg:gap-7 md:gap-4 gap-2",
            fullPage ? "grid-cols-7" : "sm:grid-cols-2 grid-cols-1"
          )}
        >
          {fullPage ? (
            <div className="xl:col-span-5 lg:col-span-4  col-span-7">
              <ProductGallery
                selectedColor={selectedColor}
                categoryId={data?.category?.id}
                shopId={data?.shop?.id}
                data={galleries}
                productId={data?.id}
              />
            </div>
          ) : (
            <ProductGalleryModal
              productId={data?.id}
              selectedColor={selectedColor}
              data={galleries}
            />
          )}
          <div className={clsx(fullPage ? "xl:col-span-2 lg:col-span-3 col-span-7" : "mt-8")}>
            {fullPage && data && <ProductActions id={data?.id} />}
            <table className="w-full">
              <thead />
              <tbody>
                {selectedStock && selectedStock?.discount && (
                  <tr>
                    <td>
                      <div className="rounded-full bg-red py-0.5 pl-0.5 px-3 max-w-max flex items-center text-white gap-1">
                        <DiscountIcon />
                        <span className="text-sm font-medium ">
                          -
                          {Math.floor(
                            (selectedStock.discount /
                              (selectedStock.price + (selectedStock?.tax || 0))) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="w-3">
                      <span className="text-sm text-end font-semibold text-primary line-through whitespace-nowrap">
                        <Price number={selectedStock?.price} />
                      </span>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <strong className="text-[22px] font-bold mr-auto">
                      {data?.translation?.title}
                    </strong>
                  </td>
                  <td className="w-3">
                    <strong className="text-[22px] text-end font-bold whitespace-nowrap">
                      <Price number={selectedStock?.total_price} />
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <span className="text-sm font-medium">
              {t("sku")}: {selectedStock?.sku}
            </span>
            {selectedStock?.whole_sale_prices?.length !== 0 && (
              <div className="my-4">
                {selectedStock?.whole_sale_prices?.map((wholeSale) => (
                  <div key={wholeSale.id} className="flex items-center justify-between">
                    <span>
                      {unitify(wholeSale.min_quantity)} - {unitify(wholeSale.max_quantity)}{" "}
                      {data?.unit?.translation?.title}
                    </span>
                    <span>
                      <Price number={wholeSale.price} />
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="border border-gray-border rounded-2xl p-4 mt-5 flex items-center justify-between dark:border-gray-inputBorder flex-wrap gap-y-2">
              <div className="flex items-center gap-2.5">
                {data?.brand && (
                  <Image
                    src={data?.brand?.img || ""}
                    alt={data?.brand?.title || ""}
                    width={22}
                    height={15}
                    className="object-contain"
                  />
                )}
                <span className="text-sm font-medium hover:underline">
                  {t("brand")} -{" "}
                  {data?.brand ? (
                    <Link href={`/products?brands=${data?.brand?.id}`}>{data?.brand?.title}</Link>
                  ) : (
                    t("unknown")
                  )}
                </span>
              </div>
              {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-700 dark:bg-gray-100 xl:hidden 2xl:block" /> */}
              <div className="flex items-center gap-2.5">
                <StoreIcon />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {t("store")} -{" "}
                    <Link href={`/shops/${data?.shop?.slug}`} className="hover:underline">
                      {data?.shop?.translation?.title}
                    </Link>
                  </span>
                  {data?.shop?.verify && (
                    <span>
                      <VerifiedIcon size={14} />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="border border-gray-border dark:border-gray-inputBorder rounded-2xl p-4 mt-2 flex items-center justify-between">
              {(selectedStock && data && selectedStock.quantity < data?.min_qty) ||
              !selectedStock?.quantity ? (
                <span className="text-sm font-medium">{t("out.of.stock")}</span>
              ) : (
                <div className="flex items-center gap-2.5">
                  <GreenCheckIcon />
                  <span className="text-sm font-medium">
                    {t("in.stock")} - {unitify(selectedStock?.quantity, data?.interval)}{" "}
                    {t("products")}
                  </span>
                </div>
              )}
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700 dark:bg-gray-100" />
              <div className="flex items-center gap-2.5">
                <StarIcon />
                <span className="text-sm font-medium">{data?.r_avg || 0}</span>
              </div>
            </div>
            {fullPage && (
              <div className="border border-gray-border rounded-2xl p-4 mt-2 dark:border-gray-inputBorder">
                <div className="font-semibold text-lg">{t("short.description")}</div>
                <span className="text-base line-clamp-3">{data?.translation?.description}</span>
              </div>
            )}
            <ProductStock
              selectedStock={selectedStock}
              onSelectStock={(stock) => setSelectedStock(stock)}
              minQty={data?.min_qty}
              stocks={data?.stocks}
              fullPage={fullPage}
              maxQty={data?.max_qty}
              onSelectColor={(value) => setSelectedColor(value)}
              interval={data?.interval}
              onScrolled={(value) => setShowProductStickyInfo(value)}
            />
          </div>
        </div>
        {fullPage && (
          <div className="mt-10">
            <ProductList
              type="alsoBought"
              visibleListCount={6}
              title="with.this.product.also.buy"
              link="/also-bought"
              productId={data?.id}
            />
            {user && (
              <>
                <div className="h-10" />
                <ProductList
                  link="/recently-viewed"
                  type="history"
                  visibleListCount={6}
                  title="recently.viewed"
                />
              </>
            )}
          </div>
        )}
        {fullPage && (
          <div className="grid grid-cols-7 gap-7 mt-10">
            <div className="xl:col-span-5 lg:col-span-4  col-span-7">
              <div className="font-semibold text-lg mb-5">{t("description")}</div>
              <span className="text-base">{data?.translation?.description}</span>
              <div className="font-semibold text-lg mb-5 mt-10">{t("specification")}</div>
              <div className="grid grid-cols-2 sm:gap-7 gap-2">
                {halfProperties?.length !== 0 && (
                  <div className="border border-gray-border dark:border-gray-bold sm:py-10 sm:px-5 py-4 px-2 rounded-2xl flex flex-col">
                    {halfProperties?.map((property) => (
                      <div
                        className={clsx("flex justify-between items-center py-4")}
                        key={property.id}
                      >
                        <span className="text-sm">{property.group?.translation?.title}</span>
                        <span className="text-sm">{property.value?.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {secondHalfProperties && secondHalfProperties?.length > 0 && (
                  <div className="border border-gray-border sm:py-10 sm:px-5 py-4 px-2 rounded-2xl flex flex-col dark:border-gray-bold">
                    {secondHalfProperties?.map((property) => (
                      <div
                        className={clsx("flex justify-between items-center py-4")}
                        key={property.id}
                      >
                        <span className="text-sm">{property?.group?.translation?.title}</span>
                        <span className="text-sm">{property.value.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="xl:col-span-2 lg:col-span-3 col-span-7">
              <SuggestionList />
            </div>
            <div className="xl:col-span-5 lg:col-span-4  col-span-7">
              <ReviewList title="reviews" type="products" id={data?.uuid} />
            </div>
            <div className="xl:col-span-2 lg:col-span-3 col-span-7">
              <ReviewSummary typeId={data?.id} type="products" />
              <CreateReview id={data?.id} uuid={data?.uuid} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
