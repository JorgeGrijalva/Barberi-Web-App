"use client";

import { Types } from "@/context/search/search.reducer";
import dayjs from "dayjs";
import { Button } from "@/components/button";
import { useSearch } from "@/context/search";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { TimeSelect } from "@/components/search-field-core/time-select";

const SearchTime = () => {
  const { state, dispatch } = useSearch();
  const { t } = useTranslation();
  const router = useRouter();
  const handleChangeFromTime = (time: Date) => {
    dispatch({
      type: Types.SetTime,
      payload: {
        from: dayjs(time).format("HH:mm"),
        to: dayjs(time).add(1, "hour").format("HH:mm"),
      },
    });
  };
  const handleChangeToTime = (time: Date) => {
    dispatch({
      type: Types.SetTime,
      payload: {
        from: state.searchTime.time?.from || dayjs(time).subtract(1, "hour").format("hh:mm a"),
        to: dayjs(time).format("hh:mm a"),
      },
    });
  };
  return (
    <section className="xl:container px-4 pt-7 h-[calc(100svh-80px)] flex flex-col justify-between ">
      <div className="flex items-center gap-4 ">
        <TimeSelect
          value={
            state.searchTime.time ? dayjs(state.searchTime.time.from, "HH:mm").toDate() : undefined
          }
          label="from"
          onChange={(value: Date) => {
            handleChangeFromTime(value);
          }}
          showPastTime={
            // eslint-disable-next-line no-nested-ternary
            state.date.query
              ? dayjs(state.date.query, "DD, MM YYYY").isSame(dayjs(), "day")
              : undefined
          }
        />
        <TimeSelect
          label="to"
          onChange={(value) => {
            handleChangeToTime(value);
          }}
          value={
            state.searchTime.time?.to
              ? dayjs(state.searchTime.time.to, "HH:mm").toDate()
              : undefined
          }
          showPastTime={
            // eslint-disable-next-line no-nested-ternary
            state.date.query
              ? dayjs(state.date.query, "DD, MM YYYY").isSame(dayjs(), "day")
              : undefined
          }
        />
      </div>
      <div className="md:hidden">
        <Button
          size="medium"
          color="black"
          disabled={!state.searchTime.time?.from}
          onClick={() => router.back()}
          fullWidth
        >
          {t("search")}
        </Button>
      </div>
    </section>
  );
};

export default SearchTime;
