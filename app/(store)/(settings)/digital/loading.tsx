const DigitalProductsPageLoading = () => (
  <div className="xl:container px-2 md:px-4">
    <div className="grid grid-cols-7">
      <div className="flex flex-col gap-7 col-span-5">
        <div className="flex gap-7 animate-pulse">
          <div className="relative overflow-hidden lg:h-[320px] md:h-56 h-40 rounded-3xl aspect-[250/320] bg-gray-300" />
          <div className="flex-1 my-5">
            <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
            <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
            <div className="h-4 mt-4 rounded-full bg-gray-300 w-3/5" />
          </div>
        </div>
        <div className="flex gap-7 animate-pulse">
          <div className="relative overflow-hidden lg:h-[320px] md:h-56 h-40 rounded-3xl aspect-[250/320] bg-gray-300" />
          <div className="flex-1 my-5">
            <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
            <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
            <div className="h-4 mt-4 rounded-full bg-gray-300 w-3/5" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DigitalProductsPageLoading;
