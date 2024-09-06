"use client";

import { Button } from "@/components/button";
import FilterLineIcon from "remixicon-react/FilterLineIcon";
import SortNumberAscIcon from "remixicon-react/SortAscIcon";
import SortNumberDescIcon from "remixicon-react/SortDescIcon";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/hook/use-modal";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hook/use-media-query";
import { Translate } from "@/components/translate";
import { Select } from "@/components/select";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import { FilteredProductList } from "./filtered-product-list";

const FilterList = dynamic(() =>
  import("../filters/filter-list").then((component) => ({ default: component.FilterList }))
);

const ProductList = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const [isFilterDrawerOpen, openFilterDrawer, closeFilterDrawer] = useModal();
  const isSmallScreen = useMediaQuery("(max-width: 1280px)");
  const [totalProducts, setTotalProducts] = useState(0);
  const sortOptions = [
    {
      title: t("ascending"),
      id: "asc",
    },
    { title: t("descending"), id: "desc" },
  ];
  const [sortType, setSortType] = useState(
    searchParams.get("sort") === "desc" ? sortOptions[1] : sortOptions[0]
  );

  useEffect(() => {
    setSortType(searchParams.get("sort") === "desc" ? sortOptions[1] : sortOptions[0]);
  }, [searchParams.get("sort")]);

  const handleChangeSortType = (type: { title: string; id: string }) => {
    setQueryParams({ sort: type.id }, false);
  };

  return (
    <div className="col-span-7">
      <div className="sm:hidden flex justify-between">
        <h1 className="md:text-[26px] text-xl font-semibold mb-7">
          <Translate value="all.products" />
        </h1>
        <h2 className="text-xl font-medium">
          <span>{totalProducts} </span>
          <Translate value="products" />
        </h2>
      </div>
      <div className="flex justify-between items-center mb-12 h-[28px]">
        <h2 className="sm:block hidden text-xl font-medium">
          <span>{totalProducts} </span>
          <Translate value="products" />
        </h2>
        <Select
          options={sortOptions}
          extractKey={(option) => option.id}
          extractTitle={(option) => option?.title}
          onSelect={handleChangeSortType}
          icon={sortType.id === "asc" ? <SortNumberAscIcon /> : <SortNumberDescIcon />}
          value={sortType}
          className="h-[30px] min-w-[130px]"
        />
        <div className="xl:hidden">
          <Button
            onClick={openFilterDrawer}
            size="xsmall"
            color="black"
            leftIcon={<FilterLineIcon />}
          >
            {t("filters")}
          </Button>
        </div>
      </div>
      <FilteredProductList setTotalProducts={setTotalProducts} />
      <Drawer open={isFilterDrawerOpen && isSmallScreen} onClose={closeFilterDrawer}>
        <FilterList onClose={closeFilterDrawer} />
      </Drawer>
    </div>
  );
};

export default ProductList;
