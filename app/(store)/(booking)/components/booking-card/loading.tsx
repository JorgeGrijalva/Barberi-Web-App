import clsx from "clsx";

export const BookingCardLoading = () => (
  <div className={clsx("p-2.5 rounded-button border border-gray-link animate-pulse")}>
    <div className="flex items-center md:gap-4 gap-2.5 md:py-5 py-2.5 md:px-2.5 px-0.5">
      <div className="relative xl:w-20 xl:h-20 w-14 h-14 aspect-square bg-gray-300 rounded-full" />
      <div className="text-start flex-1">
        <div className="bg-gray-300 w-3/5 rounded-full xl:h-7 md:h-6 h-5" />
        <div className="bg-gray-300 h-4 mt-2 w-2/5 rounded-full " />
      </div>
    </div>
  </div>
);
