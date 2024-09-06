/* eslint-disable @next/next/no-img-element */
import { brandService } from "@/services/brand";
import clsx from "clsx";

interface BrandsProps {
  reverse?: boolean;
  slower?: boolean;
}

export const Brands = async ({ reverse, slower }: BrandsProps) => {
  const list = await brandService.getAll();
  const brandsList = reverse ? list.data?.reverse() : list?.data;
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden md:gap-7 gap-2.5">
      <ul
        className={clsx(
          "flex items-center justify-center md:justify-start md:gap-7 gap-2.5 [&_img]:max-w-none ",
          slower ? "animate-infinite-scroll-2" : "animate-infinite-scroll"
        )}
      >
        {brandsList?.map((brand) => (
          <li
            key={brand.id}
            className="md:w-[282px] w-[168px] md:h-[120px] h-20 relative rounded-button bg-gray-bg flex items-center justify-center"
          >
            <img
              src={brand.img}
              alt={brand.title || "brand"}
              className="w-3/5 h-3/5 object-contain"
            />
          </li>
        ))}
      </ul>
      <ul
        className={clsx(
          "flex items-center justify-center md:justify-start md:gap-7 gap-2.5 [&_img]:max-w-none ",
          slower ? "animate-infinite-scroll-2" : "animate-infinite-scroll"
        )}
        aria-hidden
      >
        {brandsList?.map((brand) => (
          <li
            key={brand.id}
            className="md:w-[282px] w-[168px] md:h-[120px] h-20 relative rounded-button bg-gray-bg flex items-center justify-center"
          >
            <img
              src={brand.img}
              alt={brand.title || "brand"}
              className="w-3/5 h-3/5 object-contain"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
