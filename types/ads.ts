import { Translation } from "@/types/global";
import { Product, ProductGallery } from "@/types/product";

interface AdTranslation extends Translation {
  description?: string;
}

export interface Ad {
  id: number;
  active: boolean;
  type: string;
  time_type: string;
  time: number;
  price: number;
  created_at: string;
  updated_at: string;
  translation: AdTranslation | null;
  galleries: ProductGallery[] | null;
}

interface AdProduct {
  id: number;
  shop_ads_package_id: number;
  product_id: number;
  product: Product;
}

interface ShopAdPackage {
  id: number;
  active: boolean;
  ads_package_id: number;
  shop_id: number;
  status: string;
  expired_at: string;
  shop_ads_products: AdProduct[];
}

export interface AdDetail extends Ad {
  shop_ads_packages?: ShopAdPackage[];
}
