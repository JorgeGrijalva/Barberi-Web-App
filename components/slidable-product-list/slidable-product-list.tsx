"use client";

import { ParamsType } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { ProductCard } from "@/components/product-card";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSettings } from "@/hook/use-settings";
import useAddressStore from "@/global-store/address";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const requestTypes = {
  paginate: productService.getAll,
  alsoBought: productService.alsoBought,
  history: productService.getViewHistory,
};

interface SlidableProductListProps {
  params?: ParamsType;
  visibleListCount: number;
  title?: string;
  link?: string;
  productId?: number;
  type?: keyof typeof requestTypes;
  extra?: React.ReactElement;
  roundedColors?: boolean;
  productVariant?: string;
}

export const SlidableProductList = ({
  params,
  visibleListCount,
  title,
  link,
  productId,
  type = "paginate",
  extra,
  roundedColors,
  productVariant = "1",
}: SlidableProductListProps) => {
  const { t } = useTranslation();
  const { currency, language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const tempParams: Record<string, string | number | undefined> = {
    ...params,
    lang: language?.locale,
    currency_id: currency?.id,
    country_id: country?.id,
    city_id: city?.id,
    region_id: country?.region_id,
  };
  if (productId) {
    tempParams.product_id = productId?.toString();
  }
  const { data, isLoading } = useQuery(["products", tempParams, type], () =>
    requestTypes[type](tempParams, productId)
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const queryParams = new URLSearchParams(tempParams);

  const responsiveOptions = useMemo(
    () => ({
      992: { slidesPerView: visibleListCount, spaceBetween: 30 },
      768: { slidesPerView: visibleListCount / 1.5, spaceBetween: 30 },
      576: { slidesPerView: visibleListCount / 2, spaceBetween: 20 },
      340: { slidesPerView: visibleListCount / 3, spaceBetween: 20 },
      0: { slidesPerView: visibleListCount / 3.5, spaceBetween: 10 },
    }),
    []
  );

  return (
    <>
      {!!title && (
        <ListHeader
          extra={extra}
          title={t(title)}
          link={
            data?.data.length !== 0 && link
              ? `${link}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
              : undefined
          }
        />
      )}
      {isLoading ? (
        <div className="flex gap-7 items-center overflow-x-hidden">
          {Array.from(Array(10).keys()).map((product) => (
            <div className="min-w-[200px]" key={product}>
              <ProductCardUi1Loading />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ minWidth: 0 }}>
          {(data?.data && data.data.length > 0) || isLoading ? (
            <Swiper breakpoints={responsiveOptions}>
              {data?.data.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    variant={productVariant}
                    roundedColors={roundedColors}
                    data={product}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Empty animated={false} text="there.is.no.products" smallText />
          )}
        </div>
      )}
    </>
  );
};
