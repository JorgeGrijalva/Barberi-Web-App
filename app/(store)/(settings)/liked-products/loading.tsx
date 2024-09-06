import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";

const LikedProductsLoading = () => (
  <div className="xl:container px-2 md:px-4 grid grid-cols-2 lg:grid-cols-3 md:gap-7 sm:gap-4 gap-2">
    {Array.from(Array(6).keys()).map((item) => (
      <ProductCardUi1Loading key={item} />
    ))}
  </div>
);

export default LikedProductsLoading;
