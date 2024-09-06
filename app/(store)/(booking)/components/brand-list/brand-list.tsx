"use client";

import ChevronRightIcon from "@/assets/icons/chevron-right";
import Image from "next/image";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand";
import { extractDataFromPagination } from "@/utils/extract-data";
import Link from "next/link";

const BrandList = () => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["brandList"],
    queryFn: ({ pageParam }) => brandService.getAll({ page: pageParam }),
    suspense: true,
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const brandList = extractDataFromPagination(data?.pages);
  return (
    <Swiper
      className="my-4"
      modules={[Navigation]}
      navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
      slidesPerView="auto"
      breakpoints={{
        0: { slidesPerView: 2 },
        576: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        992: { slidesPerView: 6 },
      }}
      onReachEnd={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      {brandList?.map((brand) => (
        <SwiperSlide key={brand.id}>
          <Link href={`/products?brands=${brand.id}`}>
            <Image
              src={brand.img}
              alt="brand"
              width={110}
              height={54}
              className="object-contain max-h-[54px]"
            />
          </Link>
        </SwiperSlide>
      ))}
      <button className="swiper-button-prev !text-dark">
        <ChevronRightIcon />
      </button>
      <button className="swiper-button-next !text-dark">
        <ChevronRightIcon />
      </button>
    </Swiper>
  );
};

export default BrandList;
