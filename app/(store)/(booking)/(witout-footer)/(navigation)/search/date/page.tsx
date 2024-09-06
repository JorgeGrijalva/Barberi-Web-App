"use client";

import { DateSelect } from "@/components/search-field-core/date-select";
import { Types } from "@/context/search/search.reducer";
import dayjs from "dayjs";
import { Button } from "@/components/button";
import { useSearch } from "@/context/search";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const SearchDate = () => {
  const { state, dispatch } = useSearch();
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <section className="xl:container px-4 pt-7 h-[calc(100svh-80px)] flex flex-col justify-between ">
      <DateSelect
        onChange={(value) => {
          dispatch({
            type: Types.SetDate,
            payload: dayjs(value).format("DD, MM YYYY"),
          });
        }}
        value={state.date.query ? dayjs(state.date.query, "DD, MM YYYY").toDate() : undefined}
      />
      <div className="md:hidden">
        <Button
          size="medium"
          color="black"
          disabled={!state.date.query}
          onClick={() => router.back()}
          fullWidth
        >
          {t("search")}
        </Button>
      </div>
    </section>
  );
};

export default SearchDate;
