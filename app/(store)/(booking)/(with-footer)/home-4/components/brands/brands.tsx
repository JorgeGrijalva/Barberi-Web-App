"use client";

import { Paginate } from "@/types/global";
import { Brand } from "@/types/brand";
import { useInfiniteQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand";
import { ListHeader } from "@/components/list-header";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { BrandCard } from "@/components/brand-card";
import Link from "next/link";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

interface BrandsProps {
  data?: Paginate<Brand>;
}

export const Brands = ({ data }: BrandsProps) => {
  const { t } = useTranslation();
  const { data: brands } = useInfiniteQuery(
    ["brands"],
    ({ pageParam }) => brandService.getAll({ page: pageParam }),
    {
      initialData: data ? { pages: [data], pageParams: [1] } : undefined,
    }
  );
  const brandList = extractDataFromPagination(brands?.pages);

  return (
    <div className="my-14">
      <ListHeader title={t("brands")} link="/brands" container />
      <div className="xl:container">
        <Swiper
          wrapperClass="pl-4 pr-0 xl:pl-0 rtl:xl:pr-4 rtl:pl-0"
          breakpoints={{
            0: { slidesPerView: 1.5, spaceBetween: 10 },
            330: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            562: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 20,
            },
            992: { slidesPerView: 5, spaceBetween: 30 },
          }}
        >
          {brandList?.map((brand) => (
            <SwiperSlide key={brand.id}>
              <Link href={buildUrlQueryParams("/products", { brands: brand.id })}>
                <BrandCard data={brand} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
