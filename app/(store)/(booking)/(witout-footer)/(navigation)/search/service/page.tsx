"use client";

import { ServiceSelect } from "@/components/search-field-core/service-select";
import { useRouter } from "next/navigation";

const SearchService = () => {
  const router = useRouter();
  return (
    <section className="xl:container px-4 pt-7 h-[calc(100svh-80px)]">
      <ServiceSelect onSelect={() => router.back()} />
    </section>
  );
};

export default SearchService;
