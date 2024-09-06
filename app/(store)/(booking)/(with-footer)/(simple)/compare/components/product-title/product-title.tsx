import { Product } from "@/types/product";
import useCompareStore from "@/global-store/compare";
import { IconButton } from "@/components/icon-button";
import TrashIcon from "@/assets/icons/trash";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { findLowestPriceInStocks } from "@/utils/find-lowest-price-in-stocks";
import { Price } from "@/components/price";

export const ProductTitle = ({ data }: { data: Product }) => {
  const deleteFromList = useCompareStore((state) => state.addOrRemove);
  return (
    <div className="max-w-compareWidth min-w-full w-full group overflow-x-auto">
      <div className="w-[168px] h-[200px] bg-gray-border rounded-xl relative">
        <div className="absolute w-[30px] h-[30px] rounded-full flex justify-center items-center right-2 top-2 bg-white bg-opacity-90 z-[2]">
          <IconButton rounded onClick={() => deleteFromList(data.id)}>
            <TrashIcon />
          </IconButton>
        </div>
        <Image
          src={data.img}
          alt={data.translation?.title || "product"}
          fill
          className="object-contain"
        />
      </div>
      <Link
        href={`/products/${data.uuid}`}
        className="block w-full text-base whitespace-nowrap overflow-hidden overflow-ellipsis font-medium hover:underline line-clamp-2 mt-3"
      >
        {data.translation?.title}
      </Link>
      <strong className="block text-xl mt-2 mb-5">
        <Price number={findLowestPriceInStocks(data.stocks)} />
      </strong>
    </div>
  );
};
