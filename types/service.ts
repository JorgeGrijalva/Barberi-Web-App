import { Translation } from "@/types/global";
import { ProductGallery } from "@/types/product";
import { Shop } from "@/types/shop";

interface ServiceTranslation extends Translation {
  description: string;
}

interface ServiceFAQTranslation extends Omit<Translation, "title"> {
  question: string;
  answer: string;
}

export interface ServiceExtras {
  active?: boolean;
  id: number;
  price: number;
  img?: string;
  translation: ServiceTranslation | null;
  service_id?: number;
  shop_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFAQ {
  id: number;
  slug: string;
  service_id: number;
  type: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  translation: ServiceFAQTranslation | null;
}

export interface Service {
  id: number;
  slug: string;
  category_id?: number;
  shop_id?: number;
  status: string;
  price: number;
  interval: number;
  pause: number;
  type: string;
  commission_fee: number;
  img: string;
  translation: ServiceTranslation | null;
  galleries: ProductGallery[] | null;
  min_price?: number;
  total_price: number;
  service_extras: ServiceExtras[] | [];
  service_faqs: ServiceFAQ[];
}

export interface ServiceMaster {
  active: boolean;
  commission_fee: number;
  created_at: string;
  discount?: number | null;
  id: number;
  interval: number;
  master_id: number;
  pause: number;
  price: number;
  service: Service | null;
  service_id: number;
  shop: Shop | null;
  shop_id: number;
  total_price: number;
  type: string;
  updated_at: string;
  service_extras: ServiceExtras[] | [];
}

export interface ServiceMasterInfo {
  service_id: number;
  master_id: number;
  id: number;
  interval?: number;
}
