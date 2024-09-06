const MembershipLoading = () => (
  <section className="xl:container px-4 md:py-7 animate-pulse">
    <div className="hidden lg:block">
      <div className="h-5 w-24 rounded-full bg-gray-300" />
    </div>
    <div className="grid lg:grid-cols-3 gap-7 mt-6">
      <div className="lg:col-span-2 rounded-button md:border border-gray-link md:px-5 md:py-6">
        <div className="font-semibold text-xl">
          <div className="h-4 w-28 rounded-full bg-gray-300" />
          <div className="lg:w-4/5 mt-5">
            <div className="rounded-button bg-gray-300 aspect-[696/460]" />
          </div>
        </div>
      </div>
      <div>
        <div className="hidden lg:block border border-gray-link rounded-button px-5 py-7">
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="h-5 w-3/5 rounded-full bg-gray-300" />
              <div className="h-3 w-full rounded-full mt-3 bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MembershipLoading;
