import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { useTranslation } from "react-i18next";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ProductCard } from "@/components/product-card";
import { InfiniteLoader } from "@/components/infinite-loader";
import AnimatedContent from "@/components/animated-content";
import * as animationData from "@/public/lottie/empty_list.json";
import useAddressStore from "@/global-store/address";

interface SimilarProductsProps {
  categoryId?: number;
  shopId?: number;
  productId?: number;
}

const SimilarProducts = ({ categoryId, shopId, productId }: SimilarProductsProps) => {
  const { t } = useTranslation();
  const country = useAddressStore((state) => state.country);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["products", categoryId, shopId, productId],
    ({ pageParam }) =>
      productService.getAll({
        category_id: categoryId,
        shop_id: shopId,
        "not_in[0]": productId,
        page: pageParam,
        region_id: country?.region_id,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const productList = extractDataFromPagination(data?.pages);

  if (productList && productList.length === 0) {
    return (
      <div className="md:py-10 md:px-10 py-6 px-2">
        <h5 className="text-2xl font-semibold mb-4">{t("similar.products")}</h5>
        <AnimatedContent animationData={animationData} />
      </div>
    );
  }

  return (
    <div className="md:py-10 md:px-10 py-6 px-2">
      <h5 className="text-2xl font-semibold mb-4">{t("similar.products")}</h5>
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 xl:gap-7 gap-4">
          {isLoading
            ? Array.from(Array(6).keys()).map((product) => <ProductCardUi1Loading key={product} />)
            : productList?.map((product) => <ProductCard data={product} key={product.id} />)}
        </div>
      </InfiniteLoader>
    </div>
  );
};

export default SimilarProducts;
