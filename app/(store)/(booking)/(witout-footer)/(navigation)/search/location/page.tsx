"use client";

import { PlaceSelect } from "@/components/search-field-core/place-select";
import { useRouter } from "next/navigation";

const SearchLocation = () => {
  const router = useRouter();
  return (
    <section className="xl:container px-4 pt-7 h-[calc(100svh-80px)]">
      <PlaceSelect onSelect={() => router.back()} />
    </section>
  );
};

export default SearchLocation;
