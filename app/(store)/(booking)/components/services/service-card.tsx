import { Category } from "@/types/category";
import { serviceBgs, serviceColors } from "@/config/global";
import Image from "next/image";

interface ServiceCardProps {
  data?: Category;
  index?: number;
  length?: number;
}

export const ServiceCard = ({ data, index, length }: ServiceCardProps) => (
  <div
    style={{
      backgroundColor:
        typeof index !== "undefined" && length
          ? serviceColors[Math.floor(length % index)]
          : undefined,
      backgroundImage:
        typeof index !== "undefined" && length
          ? `url(${serviceBgs[Math.floor(length % index)]})`
          : undefined,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
    className="rounded-button relative overflow-hidden flex flex-col md:max-w-[200px]"
  >
    <div className="pt-6 pl-6">
      <span className="md:text-xl text-lg font-semibold line-clamp-1">
        {data?.translation?.title}
      </span>
    </div>
    <div className="flex items-end justify-end flex-1">
      <div className="relative bottom-0 right-0 max-h-[80%] w-full  min-h-[100px]">
        <Image
          src={data?.img || ""}
          alt={data?.translation?.title || "service"}
          fill
          className="object-contain max-w-max right-0 !left-auto"
        />
      </div>
    </div>
  </div>
);
