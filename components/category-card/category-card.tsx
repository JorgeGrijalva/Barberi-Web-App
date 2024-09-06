import { Category } from "@/types/category";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const sizes = {
  small: "px-5 py-4 gap-1",
  large: "px-7 py-8 gap-4",
} as const;

const fontSizes = {
  small: "text-sm",
  large: "text-xl",
};

interface CategoryCardProps {
  data: Category;
  size: keyof typeof sizes;
  bordered?: boolean;
}

export const CategoryCard = ({ size = "small", data, bordered }: CategoryCardProps) => (
  <Link href={`/products?categories=${data.id}`}>
    <div
      className={clsx(
        "flex flex-col",
        !bordered && "bg-gray-card dark:bg-gray-inputBorder rounded-2xl",
        !bordered && sizes[size]
      )}
    >
      <div
        className={clsx(
          bordered && "border border-gray-border dark:border-gray-inputBorder rounded-lg mb-2.5",
          bordered && sizes[size]
        )}
      >
        <div className="relative aspect-square">
          <Image
            src={data.img || ""}
            alt={data.translation?.title || "category"}
            fill
            className="object-contain"
            sizes="(max-width: 376px) 68px, (max-width: 576px) 90px, (max-width: 768px) 72px, (max-width: 992px) 108px, (max-width: 1200px) 66px, 100px"
          />
        </div>
      </div>
      <span
        className={clsx(
          !bordered && fontSizes[size],
          "font-medium text-center line-clamp-1",
          bordered && "text-base font-normal"
        )}
      >
        {data.translation?.title}
      </span>
    </div>
  </Link>
);
