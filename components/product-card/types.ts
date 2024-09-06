import { Product, ProductExpandedGallery, Stock } from "@/types/product";

export interface ProductCardUIProps {
  data: Product;
  onIncrementProductCount: () => void;
  onDecrementProductCount: () => void;
  cartQuantity?: number;
  params?: string;
  gallery?: ProductExpandedGallery[];
  selectedStock: Stock;
  onColorClick: (stock: Stock) => void;
  isSame: boolean;
  roundedColors?: boolean;
  cartDetailId?: number;
}
