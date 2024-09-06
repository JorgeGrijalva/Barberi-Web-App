import CircularLoading from "@/assets/icons/circular-loading";

const Loading = () => (
  <section className="relative min-h-[70vh]">
    <div className="flex justify-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <CircularLoading size={60} />
    </div>
  </section>
);

export default Loading;
