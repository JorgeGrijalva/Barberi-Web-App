const MembershipsLoading = () => (
  <div className="xl:container px-4 my-7">
    <div className="h-7 w-28 rounded-full bg-gray-300 mb-4" />
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-7 gap-2.5">
      {Array.from(Array(6).keys()).map((item) => (
        <div className="aspect-[2/1.2] rounded-button bg-gray-300 animate-pulse" key={item} />
      ))}
    </div>
  </div>
);

export default MembershipsLoading;
