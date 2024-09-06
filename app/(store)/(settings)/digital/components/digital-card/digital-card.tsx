"use client";

import React, { useState } from "react";
import { Product, ProductExpandedGallery } from "@/types/product";
import { useSearchParams } from "next/navigation";
import DigitalCardUi from "./digital-card-ui";

interface DigitalCardProps {
  data: Product;
  digitalFileId: number;
}

export const DigitalCard = ({ data, digitalFileId }: DigitalCardProps) => {
  const defaultStock = data && data.stocks && data.stocks[0];
  const [selectedStock, setSelectedStock] = useState(defaultStock);
  const queryParams = useSearchParams();
  const stockGalleries: ProductExpandedGallery[] = [];
  data.stocks.forEach((stock) => {
    if (stock.gallery) {
      stockGalleries.push({
        img: stock.gallery.path,
        stock,
        color: stock.extras.find((extra) => extra.group?.type === "color")?.value,
      });
    }
  });
  const defaultImage: ProductExpandedGallery[] = [
    {
      img: data.img,
      stock: defaultStock,
    },
  ];
  const gallery = defaultImage.concat(stockGalleries);
  return (
    <DigitalCardUi
      digitalFileId={digitalFileId}
      data={data}
      params={queryParams.toString()}
      gallery={gallery}
      selectedStock={selectedStock}
      onColorClick={(stock) => setSelectedStock(stock)}
    />
  );
};
