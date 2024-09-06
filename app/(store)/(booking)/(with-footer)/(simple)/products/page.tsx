import React from "react";
import fetcher from "@/lib/fetcher";
import { Paginate } from "@/types/global";
import { Banner } from "@/types/banner";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { cookies } from "next/headers";
import { Translate } from "@/components/translate";
import { Banners } from "./components/banners";
import { FilterList } from "./components/filters/filter-list";
import FilteredProductList from "./components/filtered-product-list";
import { Brands } from "./components/brands";

const Products = async () => {
  const lang = cookies().get("lang")?.value;
  const banners = await fetcher<Paginate<Banner>>(
    buildUrlQueryParams("v1/rest/banners/paginate", { lang }),
    {
      cache: "no-cache",
    }
  );
  return (
    <div>
      <div className="my-7">
        <Banners banners={banners} />
      </div>
      <div className="px-2 xl:container">
        <Brands />
        <h1 className="sm:block hidden md:text-[26px] text-xl font-semibold mb-7">
          <Translate value="all.products" />
        </h1>
        <div className="grid xl:grid-cols-9 grid-cols-1 lg:gap-7 md:gap-4 gap-2">
          <div className="xl:col-span-2 hidden xl:block relative">
            <FilterList />
          </div>
          <FilteredProductList />
        </div>
      </div>
    </div>
  );
};

export default Products;
