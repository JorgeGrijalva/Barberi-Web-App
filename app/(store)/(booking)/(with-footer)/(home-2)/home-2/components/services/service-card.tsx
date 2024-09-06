import { Category } from "@/types/category";
import Image from "next/image";

interface ServiceCardProps {
  data?: Category;
}

export const ServiceCardUi2 = ({ data }: ServiceCardProps) => (
  <div className="overflow-hidden flex flex-col items-center justify-between">
    <div className="relative flex items-center justify-center h-[152px] w-[136px] bg-gray-50 rounded-xl overflow-hidden">
      <Image
        src={data?.img || ""}
        alt={data?.translation?.title || "service"}
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
    <div className="pt-2.5">
      <span className="text-xl font-semibold">{data?.translation?.title}</span>
    </div>
  </div>
);
