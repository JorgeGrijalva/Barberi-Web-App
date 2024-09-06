import { ProductGallery } from "@/types/product";
import { Coordinate, Location, Translation } from "./global";

interface ShopTranslation extends Translation {
  description: string;
  address: string;
}

export interface ShopClosedDate {
  id: number;
  day: string;
}

export interface WorkingDay {
  id: number;
  created_at: string;
  day: string;
  from: string;
  to: string;
  updated_at: string;
  disabled?: boolean;
}

export interface ShopSocial {
  id: number;
  content: string;
  type: string;
}

export interface Shop {
  background_img: string;
  close_time: string;
  open_time: string;
  created_at: string;
  id: number;
  lat_long: Location;
  logo_img: string;
  open: boolean;
  percentage: number;
  status: string;
  status_note: string;
  tax: number;
  translation: ShopTranslation | null;
  updated_at: string;
  user_id: number;
  uuid: string;
  visibility: boolean;
  verify: boolean;
  shop_working_days: WorkingDay[];
  r_avg?: number;
  r_count?: number;
  distance?: number;
  shop_closed_date: ShopClosedDate[];
  slug: string;
  delivery_time: {
    to: string;
    from: string;
    type: string;
  };
  phone?: string;
  socials?: ShopSocial[];
}

export interface IDelivery {
  active: boolean;
  create_at: string;
  id: number;
  note: string;
  price: number;
  shop_id: number;
  times: string[];
  translation: Translation | null;
  type: string;
  updated_at: string;
}

export interface ShopDetail extends Shop {
  seller: {
    fistname: string;
    lastname: string;
    id: number;
    role: string;
  };
  rating_avg: string;
  subscription: {
    id: number;
    shop_id: number;
    subscription_id: number;
    expired_at: string;
    price: number;
    type: string;
    active: number;
    created_at: string;
    updated_at: string;
  };
}

export interface StoreWithDelivery extends Shop {
  deliveries: IDelivery[];
}

export interface CreateShopCredentials {
  lat_long: number[];
  phone: string;
  title: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  address: {
    [key: string]: string;
  };
  images: string[];
}

export interface CreateShopBody
  extends Omit<
    CreateShopCredentials,
    "images" | "location" | "open_time" | "close_time" | "delivery_time_type" | "delivery_type"
  > {
  location: Coordinate;
  logo_image: string;
  bg_image: string;
}

export interface ShopGallery {
  id: number;
  shop_id: number;
  galleries: ProductGallery[];
}

export interface ShopTag {
  translation?: Translation;
  id: number;
}

export interface ShopFilter {
  order_by: { [key: string]: string };
  service_type: { [key: string]: string };
  service_min_price: number;
  service_max_price: number;
  interval_min: number;
  interval_max: number;
  takes: [];
  gender: { [key: string]: string };
  categories: [];
}
