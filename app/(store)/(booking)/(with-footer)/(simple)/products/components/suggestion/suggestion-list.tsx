import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import useAddressStore from "@/global-store/address";
import { SuggestionCard } from "./suggestion-card";

const SuggestionList = () => {
  const country = useAddressStore((state) => state.country);
  const { data } = useQuery(["suggestions"], () =>
    productService.getAll({ perPage: 4, region_id: country?.region_id })
  );
  return (
    <div className="flex flex-col lg:gap-5 gap-2">
      {data?.data?.map((product) => (
        <SuggestionCard key={product.id} data={product} />
      ))}
    </div>
  );
};

export default SuggestionList;
