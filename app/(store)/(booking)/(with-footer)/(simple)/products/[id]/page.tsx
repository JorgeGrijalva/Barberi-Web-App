import fetcher from "@/lib/fetcher";
import { DefaultResponse } from "@/types/global";
import { ProductFull } from "@/types/product";
import { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { ProductDetail } from "../components/product-detail";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const { data } = await fetcher<DefaultResponse<ProductFull>>(
    buildUrlQueryParams(`v1/rest/products/${params.id}`, { lang, currency_id: currencyId }),
    { redirectOnError: true }
  );
  return {
    title: data.translation?.title,
    description: data.translation?.description,
    keywords: data.keywords,
    openGraph: {
      images: {
        url: data.img,
      },
      title: data.translation?.title,
      description: data.translation?.description,
    },
  };
};

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const data = await fetcher<DefaultResponse<ProductFull>>(
    buildUrlQueryParams(`v1/rest/products/${params.id}`, { lang, currency_id: currencyId })
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.data?.translation?.title,
    image:
      data?.data?.galleries && data.data.galleries.length > 0
        ? data?.data?.galleries.map((gallery) => gallery.preview || gallery.path)
        : data?.data?.img,
    description: data.data?.translation?.description,
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: data?.data?.r_avg || 0,
        bestRating: 5,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: data?.data?.r_avg || 0,
      reviewCount: data?.data?.r_count || 0,
    },
    offers: {
      "@type": "AggregateOffer",
      offerCount: data?.data?.stocks?.length || 0,
      lowPrice: data?.data?.min_price || 0,
      highPrice: data?.data?.max_price || 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <section className="mt-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail initialData={data} fullPage />
    </section>
  );
};

export default ProductDetailPage;
