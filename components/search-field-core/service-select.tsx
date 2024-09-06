import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { extractDataFromPagination } from "@/utils/extract-data";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import { Input } from "@/components/input";
import SearchIcon from "@/assets/icons/search";
import { Button } from "@/components/button";
import { useState } from "react";
import { useDebounce } from "@/hook/use-debounce";
import { useSearch } from "@/context/search";
import { Category } from "@/types/category";
import { Types } from "@/context/search/search.reducer";
import clsx from "clsx";
import { Option } from "./option";

interface ServiceSelectProps {
  closeModal?: () => void;
  onSelect?: () => void;
}

export const ServiceSelect = ({ closeModal, onSelect }: ServiceSelectProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { state, dispatch } = useSearch();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);
  const { data: services, isLoading } = useInfiniteQuery(
    ["services", language?.locale, debouncedSearchValue],
    ({ pageParam }) =>
      categoryService.getAll({
        lang: language?.locale,
        perPage: 11,
        type: "service",
        page: pageParam,
        search: debouncedSearchValue,
        has_service: 1,
        column: "input",
        sort: "asc",
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const serviceList = extractDataFromPagination(services?.pages);
  const [tempCategory, setTempCategory] = useState<Category | undefined>(state.category.data);
  const [childServiceIdx, setChildServiceIdx] = useState(-1);
  const displayServiceList =
    childServiceIdx === -1 ? serviceList : serviceList?.[childServiceIdx].children;

  const handleSelectCategory = () => {
    if (!tempCategory) return;
    dispatch({ type: Types.SetCategory, payload: tempCategory });
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <div
      className={clsx(
        "md:pt-6  md:px-5 h-full md:h-auto flex flex-col justify-between md:justify-start",
        !!closeModal && "pb-6"
      )}
    >
      <div>
        {!!closeModal && (
          <button className="md:flex items-center gap-2.5 text-base hidden" onClick={closeModal}>
            <ArrowLeftLineIcon size={24} />
            {t("back")}
          </button>
        )}
        <div className="mb-5 md:mt-5">
          <Input
            fullWidth
            leftIcon={<SearchIcon />}
            value={searchValue}
            onChange={(e) => {
              setChildServiceIdx(-1);
              setSearchValue(e.target.value);
            }}
            label={t("search.services")}
          />
        </div>
        {searchValue.length === 0 && (
          <div className="mb-5 text-lg font-semibold">{t("popular.categories")}</div>
        )}
        {serviceList?.length === 0 && (
          <div className="flex items-center justify-center py-5 gap-3 flex-col">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-link">
              <SearchIcon />
            </div>
            <span className="text-sm font-medium">{t("no.results.found")}</span>
          </div>
        )}
        <div className="flex items-center flex-wrap gap-2.5">
          {isLoading ? (
            Array.from(Array(12).keys()).map((item) => (
              <div className="rounded-button bg-gray-300 h-10 w-24" key={item} />
            ))
          ) : (
            <>
              {childServiceIdx !== -1 && (
                <Option text={<ArrowLeftLineIcon />} onClick={() => setChildServiceIdx(-1)} />
              )}
              {displayServiceList?.map((service, idx) => (
                <Option
                  isSelected={
                    tempCategory
                      ? tempCategory?.id.toString() === service.id.toString()
                      : state.category.categoryId === service.id.toString()
                  }
                  key={service.id}
                  text={service?.translation?.title}
                  img={service.img}
                  onClick={() => {
                    if (service.children?.length) {
                      setChildServiceIdx(idx);
                    }
                    setTempCategory(service);
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <Button
        onClick={() => {
          handleSelectCategory();
          if (onSelect) {
            onSelect();
          }
        }}
        size="medium"
        color="black"
        fullWidth
        className="mt-10"
      >
        {t("search")}
      </Button>
    </div>
  );
};
