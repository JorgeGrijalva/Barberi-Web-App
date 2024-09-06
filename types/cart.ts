import { Country, Region } from "@/types/global";
import { Shop } from "@/types/shop";
import { ProductGallery, Stock } from "@/types/product";
import { UserDetail } from "@/types/user";

export interface InsertProduct {
  stock_id: number;
  quantity: number;
  images?: string[];
}

export interface InsertCartPayload {
  currency_id: number;
  rate: number;
  region_id: number;
  country_id: number;
  products: InsertProduct[];
  city_id?: number;
  cart_id?: number;
  user_cart_uuid?: string;
}

export interface CartDetailProduct {
  bonus: boolean;
  discount: number;
  id: number;
  price?: number;
  quantity: number;
  stock: Stock;
  replace_stock: Stock | null;
  replace_quantity: number | null;
  replace_note: string | null;
  total_price?: number;
  galleries?: ProductGallery[];
  image?: string;
}

export interface CartDetailShop {
  discount: number;
  price: number;
  tax: number;
  total_price: number;
  stocks: CartDetailProduct[];
  shop?: Shop;
}

export interface CartDetail {
  shop: Shop;
  coupon_price: number | null;
  discount: number | null;
  id: number;
  shop_id: number;
  shop_tax: number;
  total_price: number;
  cartDetailProducts: CartDetailProduct[];
}

export interface UserCart {
  cart_id: number;
  id: number;
  name: string | null;
  status: boolean;
  user_id: number;
  uuid: string;
  cartDetails: CartDetail[];
  user?: UserDetail;
}

export interface Cart {
  country: Country | null;
  region: Region | null;
  country_id: number;
  region_id: number;
  group: boolean;
  owner_id: number;
  created_at: string;
  status: boolean;
  total_price: number;
  updated_at: string;
  user_carts: UserCart[];
  id: number;
}

interface CalculateGroup {
  price: number;
  shop_id: number;
}

interface CalculateError {
  message: string;
  shop_id: number;
}

export interface CartCalculateRes {
  total_tax: number;
  price: number;
  total_shop_tax: number;
  total_price: number;
  total_discount: number;
  delivery_fee?: CalculateGroup[] | number;
  errors: CalculateError[];
  km: number;
  service_fee: number;
  rate: number;
  total_coupon_price?: number;
  receipt_discount: number;
  receipt_count: number;
  shops: CartDetailShop[];
  coupon: CalculateGroup[];
}

export interface CartCalculateBody {
  currency_id?: number;
  delivery_type?: string;
  delivery_price_id?: number;
  delivery_point_id?: number;
  country_id?: number;
  city_id?: number;
  coupon?: Record<number, string | undefined>;
  lang?: string;
}

export interface OpenCartCredentials {
  currency_id?: number;
  region_id?: number;
  country_id?: number;
  city_id?: number;
}

export interface JoinCartCredentials {
  cart_id?: number;
  region_id?: number;
  country_id?: number;
  name: string;
  city_id?: number;
}
