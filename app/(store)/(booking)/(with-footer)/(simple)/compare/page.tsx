"use client";

import useCompareStore from "@/global-store/compare";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { LoadingCard } from "@/components/loading";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import React, { useState } from "react";
import StarSmileIcon from "@/assets/icons/star-smile";
import clsx from "clsx";
import useAddressStore from "@/global-store/address";
import { BackButton } from "@/components/back-button";
import { useSettings } from "@/hook/use-settings";
import { MainInfo } from "./components/main-info";
import { AdditionalInfo } from "./components/additional-info";
import { ProductTitle } from "./components/product-title";

const ComparePage = () => {
  const { language, currency, settings } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const { t } = useTranslation();
  const compareList = useCompareStore((state) => state.ids);
  const { data, isLoading } = useQuery(
    ["compareList", compareList, country?.id, city?.id],
    () =>
      productService.compare({
        ids: compareList,
        lang: language?.locale,
        currency_id: currency?.id,
        country_id: country?.id,
        city_id: city?.id,
        region_id: country?.region_id,
      }),
    {
      enabled: compareList.length > 0,
    }
  );
  const products = data?.data;

  if ((data?.data && data.data.length === 0) || compareList.length === 0) {
    return (
      <section className="xl:container px-2 md:px-4">
        <div className="flex items-center justify-center flex-col my-20">
          <Image src="/img/empty_cart.png" alt="empty_cart" width={400} height={400} />
          <span className="text-lg font-medium">{t("compare.list.is.empty")}</span>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return <LoadingCard centered />;
  }

  const categories = products?.map((product) => product[0].category);
  const allStocks = products?.[selectedCategoryIndex].flatMap((product) => product.stocks);
  const allProperties = products?.[selectedCategoryIndex].flatMap((product) => product.properties);
  const productIds = products?.[selectedCategoryIndex].map((product) => product.id);
  const productsMainInfo = products?.[selectedCategoryIndex]
    ? Object.assign(
        {},
        ...(products?.[selectedCategoryIndex]?.map((product) => ({
          [product.id]: { category: product.category, brand: product.brand },
        })) || [])
      )
    : {};

  return (
    <section className="xl:container pb-5 px-4 relative my-7">
      <BackButton title="compare" />
      <div
        className={clsx(
          "relative overflow-x-auto",
          (settings?.ui_type === "3" || settings?.ui_type === "4") &&
            "px-3 py-3 bg-white dark:p-0 dark:bg-transparent rounded-xl mt-4"
        )}
      >
        {categories && categories.length > 1 && (
          <div className="border border-gray-border rounded-2xl max-w-max flex items-center overflow-hidden my-3 dark:border-gray-bold overflow-x-auto">
            {categories?.map((category, index) => (
              <button
                onClick={() => setSelectedCategoryIndex(index)}
                key={category?.id}
                className={clsx(
                  "px-4 py-3 text-sm outline-none focus-ring",
                  selectedCategoryIndex === index && "bg-primary text-white"
                )}
              >
                {category?.translation?.title}
              </button>
            ))}
          </div>
        )}
        <table className="mt-8 border-collapse">
          <thead />
          <tbody>
            <tr className="flex">
              {products?.[selectedCategoryIndex].map((product, index) => (
                <td
                  className={clsx(
                    "border-r border-b border-gray-border",
                    index === 0
                      ? "min-w-[220px] w-[220px]  pr-[50px]"
                      : "min-w-[270px] w-[270px]  px-[50px]"
                  )}
                >
                  <ProductTitle data={product} key={product.id} />
                </td>
              ))}
            </tr>
            <tr className="flex">
              {products?.[selectedCategoryIndex].map((product, index) => (
                <td
                  className={clsx(
                    "border-r border-b border-gray-border py-5",
                    index === 0
                      ? "min-w-[220px] w-[220px]  pr-[50px]"
                      : "min-w-[270px] w-[270px]  px-[50px]"
                  )}
                >
                  <div className="text-base font-semibold text-primary">
                    {product.stocks.length || 0} {t("options")}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="flex">
              {products?.[selectedCategoryIndex].map((product, index) => (
                <td
                  className={clsx(
                    "border-r border-b border-gray-border py-5",
                    index === 0
                      ? "min-w-[220px] w-[220px]  pr-[50px]"
                      : "min-w-[270px] w-[270px]  px-[50px]"
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-yellow">
                      <StarSmileIcon size="20" />
                    </span>
                    <span className="text-base">{product.r_avg}</span>
                  </div>
                </td>
              ))}
            </tr>
            <MainInfo
              productMainInfo={productsMainInfo}
              productIds={productIds}
              stocks={allStocks}
            />
          </tbody>
        </table>
        <div className="h-8" />
        <AdditionalInfo productIds={productIds} properties={allProperties} />
      </div>
    </section>
  );
};

export default ComparePage;
