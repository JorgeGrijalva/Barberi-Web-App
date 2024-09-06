"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchIcon from "@/assets/icons/search";
import { Button } from "@/components/button";

type Props = {
  searchValue: string;
  setSearchValue: (value: string) => void;
};

export const SearchInput = ({ searchValue, setSearchValue }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(searchValue || "");
  const handleSearch = () => {
    setSearchValue(search);
  };
  return (
    <div className="max-w-[520px] border-[1px] px-1 border-gray-border rounded-xl overflow-hidden flex items-center">
      <div className="pl-3">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder={t("find.brand")}
        className="w-full py-3 px-2 outline-none"
        onChange={(e) => setSearch(e.target.value)}
        defaultValue={search}
      />
      <Button color="black" size="small" onClick={handleSearch}>
        {t("search")}
      </Button>
    </div>
  );
};
