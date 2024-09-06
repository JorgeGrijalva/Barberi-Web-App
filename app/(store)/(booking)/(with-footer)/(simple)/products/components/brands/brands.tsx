"use client";

import { Paginate } from "@/types/global";
import { Brand } from "@/types/brand";
import { useInfiniteQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand";
import { ListHeader } from "@/components/list-header";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { BrandCard, BrandCardLoading } from "@/components/brand-card";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";

interface BrandsProps {
  data?: Paginate<Brand>;
}

export const Brands = ({ data }: BrandsProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const { data: brands, isLoading } = useInfiniteQuery(
    ["brands"],
    ({ pageParam }) => brandService.getAll({ page: pageParam }),
    {
      initialData: data ? { pages: [data], pageParams: [1] } : undefined,
    }
  );
  const allParamsSelectedBrands = searchParams.getAll("brands");
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.has("brands") ? allParamsSelectedBrands : null
  );

  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brands") || null);
  }, [allParamsSelectedBrands?.length]);

  const brandList = extractDataFromPagination(brands?.pages);

  const handleClick = (id: number) => {
    setQueryParams({ brands: id });
  };

  const renderResult = () => {
    if (isLoading)
      return Array.from(Array(10).keys()).map((item) => (
        <SwiperSlide key={item} className="max-w-[250px] mr-[30px]">
          <BrandCardLoading />
        </SwiperSlide>
      ));
    return brandList?.map((brand) => (
      <SwiperSlide key={brand.id}>
        <button className="block w-full" onClick={() => handleClick(brand.id)}>
          <BrandCard data={brand} selected={selectedBrands?.includes(brand.id.toString())} />
        </button>
      </SwiperSlide>
    ));
  };

  return (
    <div className="my-14">
      <ListHeader title={t("brands")} link="/brands" />
      <Swiper
        breakpoints={{
          0: { slidesPerView: 1.5, spaceBetween: 10 },
          992: { slidesPerView: 5, spaceBetween: 30 },
        }}
      >
        {renderResult()}
      </Swiper>
    </div>
  );
};
