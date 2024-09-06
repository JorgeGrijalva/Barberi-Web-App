const ReferralsLoading = () => (
  <div className="grid sm:grid-cols-2 gap-7 animate-pulse">
    <div className="relative h-96 w-full rounded-xl bg-gray-300" />
    <div className="flex flex-col justify-between gap-8">
      <div>
        <div className="h-8 rounded-full w-full bg-gray-300 mb-3" />

        <div className="h-4 rounded-full w-4/5 bg-gray-300 mb-2" />

        <div className="h-4 rounded-full w-3/5 bg-gray-300" />
      </div>
    </div>
  </div>
);

export default ReferralsLoading;
