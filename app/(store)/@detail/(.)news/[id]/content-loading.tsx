export const NewsContentLoading = () => (
  <div className="py-10 px-8 animate-pulse">
    <div className="bg-gray-300 h-3 rounded-full w-2/5 mb-4" />
    <div className="bg-gray-300 h-5 rounded-full w-4/5" />
    <div className="w-full aspect-[4/1] rounded-2xl my-7 bg-gray-300" />
    <div className="flex flex-col gap-4">
      <div className="w-full bg-gray-300 rounded-full h-4" />
      <div className="w-4/5 bg-gray-300 rounded-full h-4" />
      <div className="w-3/5 bg-gray-300 rounded-full h-4" />
    </div>
  </div>
);
