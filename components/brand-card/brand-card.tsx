import { Brand } from "@/types/brand";
import Image from "next/image";
import clsx from "clsx";

interface BrandCardProps {
  data?: Brand;
  selected?: boolean;
}

export const BrandCard = ({ data, selected }: BrandCardProps) => (
  <div
    className={clsx(
      "py-5 px-4 flex items-center gap-3 rounded-button border border-gray-link",
      selected && "bg-primary"
    )}
  >
    <div className="relative w-20 h-20 rounded-full">
      <Image
        src={data?.img || "/img/image-load-failed.png"}
        alt={data?.title || "brand"}
        className="rounded-full object-contain"
        fill
      />
    </div>
    <div>
      <div className="text-lg font-medium">{data?.title}</div>
    </div>
  </div>
);

export const BrandCardLoading = () => (
  <div className="py-5 px-4 flex items-center gap-3 rounded-button border border-gray-link">
    <div className="w-20 h-20 rounded-full bg-gray-300" />
    <div className="w-20">
      <div className="h-4 w-full rounded-full bg-gray-300 mb-2" />
      <div className="h-4 w-10/12 rounded-full bg-gray-300" />
    </div>
  </div>
);
