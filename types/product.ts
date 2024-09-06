import { Brand } from "./brand";
import { Category } from "./category";
import { Translation } from "./global";
import { Shop } from "./shop";

export interface ProductTranslation extends Translation {
  description: string;
}

export interface ProductGallery {
  base_path: string;
  id: number;
  path: string;
  title: string;
  preview?: string;
}

export interface ExtraGroup {
  id: number;
  active: boolean;
  category_id: number;
  type: string;
  translation?: Translation;
}

export interface ExtraValue {
  active: boolean;
  extra_group_id: number;
  id: number;
  value: string;
  img?: string;
}

export interface PropertyGroup {
  id: number;
  active: boolean;
  category_id: number;
  type: string;
  translation?: Translation;
}

export interface PropertyValue {
  active: boolean;
  property_group_id: number;
  id: number;
  value: string;
  img?: string;
}

export interface Property {
  property_group_id: number;
  property_value_id: number;
  id: number;
  product_id: number;
  group: PropertyGroup;
  value: PropertyValue;
}

export interface Extra {
  extra_group_id: number;
  extra_value_id: number;
  id: number;
  stock_id: number;
  group: ExtraGroup;
  value: ExtraValue;
}

export interface StockProduct {
  id: number;
  age_limit: number;
  uuid: string;
  shop_id: number;
  category_id: number;
  keywords: string;
  brand_id: number;
  qr_code: string | null;
  digital: boolean;
  active: boolean;
  img: string;
  created_at: string;
  updated_at: string;
  r_count?: number;
  visibility: boolean;
  status: string;
  r_avg?: number;
  min_qty: number;
  max_qty: number;
  min_price: number;
  max_price: number;
  bar_code: string;
  translation: ProductTranslation | null;
  interval?: number;
  o_count?: number;
}

export type SearchProduct = Pick<
  StockProduct,
  "active" | "digital" | "id" | "img" | "shop_id" | "translation" | "uuid" | "visibility"
>;

interface WholeSalePrice {
  id: number;
  max_quantity: number;
  min_quantity: number;
  price: number;
}

export interface Stock {
  bonus: boolean | null;
  extras: Extra[];
  id: number;
  price: number;
  product_id: number;
  quantity: number;
  tax: number;
  total_price: number;
  product: StockProduct;
  discount?: number | null;
  discount_expired_at?: string;
  o_count?: number;
  od_count?: number;
  sku?: string;
  gallery: ProductGallery | null;
  galleries: ProductGallery[] | null;
  stock_extras: Extra[];
  whole_sale_prices: WholeSalePrice[];
}

export interface Unit {
  id: number;
  active: boolean;
  translation?: Translation;
  position: "before" | "after";
}

export interface Product extends StockProduct {
  translation: ProductTranslation | null;
  stocks: Stock[];
  galleries: ProductGallery[];
}

export interface ProductFull extends Product {
  unit: Unit | null;
  category: Category | null;
  brand: Brand | null;
  shop: Shop | null;
  properties: Property[];
}

export interface FilterProperty {
  id: number;
  title: string;
  img?: string;
}

export interface FilterExtraItem {
  id: number;
  value: string;
}

export interface FilterExtra {
  id: number;
  type: string;
  title: string;
  extras: FilterExtraItem[];
}

export interface Filter {
  shops: FilterProperty[];
  brands: FilterProperty[];
  categories: FilterProperty[];
  group: FilterExtra[];
  price: {
    min: number;
    max: number;
  };
  count: number;
}

export interface ProductExpandedGallery {
  stock: Stock;
  img: string;
  color?: ExtraValue;
  preview?: string;
}

export interface DigitalProduct {
  active: boolean;
  digital_file_id: number;
  downloaded: boolean;
  id: number;
  user_id: number;
  digital_file: {
    active: boolean;
    id: number;
    product_id: number;
    product: Product | null;
  } | null;
}

export interface Coupon {
  id: number;
  name: string;
  type: string;
  for: string;
  qty: number;
  price: number;
  expired_at: string;
  img: string | null;
  created_at: string;
  updated_at: string;
}
