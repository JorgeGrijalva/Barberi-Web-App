import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SuggestionCardProps {
  data: Product;
}

export const SuggestionCard = ({ data }: SuggestionCardProps) => (
  <Link href={`/products/${data.uuid}`}>
    <div className="group border border-gray-border rounded-2xl p-2.5 flex gap-7 items-center dark:border-gray-bold">
      <Image
        width={161}
        height={100}
        src={data.img}
        alt={data.translation?.title || "product"}
        className="md:aspect-[161/100] aspect-[120/100] object-cover rounded-2xl group-hover:brightness-110 transition-all"
      />
      <div className="flex flex-col gap-3">
        <div className="md:text-lg text-base font-medium line-clamp-2">
          {data.translation?.title}
        </div>
        <span className="md:text-sm text-xs font-medium text-gray-field line-clamp-1">
          {data.translation?.description}
        </span>
      </div>
    </div>
  </Link>
);
