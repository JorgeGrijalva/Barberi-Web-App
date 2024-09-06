import { Master } from "@/types/master";
import { ServiceExtras, ServiceMaster } from "@/types/service";
import { Shop } from "@/types/shop";
import { Review } from "@/types/review";
import { Currency } from "@/types/global";

export interface BookingCalculateBody {
  payment_id?: number;
  currency_id?: number;
  data: {
    service_master_id?: number;
  }[];
  start_date: string;
}

export interface BookingDate {
  closed: boolean;
  date: string;
  day: string;
  month: string;
  name: string;
  times: string[];
  disabled_times: string[];
}

export interface BookingAddress {
  address: string;
  lat: number;
  long: number;
}

export interface BookingCreateBody {
  payment_id?: number;
  currency_id?: number;
  start_date: string;
  data: {
    service_master_id?: number;
    note?: string;
    data?: BookingAddress;
  }[];
  user_gift_cart_id?: number;
  coupon?: string;
}

export interface Booking {
  extra_price?: number;
  id: number;
  commission_fee: number;
  created_at: string;
  currency_id: number;
  discount?: number | null;
  end_date: string;
  ids_by_parent: string;
  master_id: number;
  note?: string;
  price: number;
  rate: number;
  service_fee: number;
  service_master_id: number;
  shop_id: number;
  start_date: string;
  status: string;
  total_price: number;
  total_price_by_parent: number;
  type: string;
  user_id: number;
  updated_at: string;
  master: Master | null;
  service_master: ServiceMaster | null;
  shop: Shop | null;
  canceled_all: boolean;
  review: Review | null;
  data?: Record<string, any>;
  currency?: Currency;
  notes?: string[];
  parent_id?: number;
  transaction?: {
    status?: string;
    payment_system: {
      tag: string;
    };
  };
  gift_cart_price?: number;
  user_member_ship?: {
    id: number;
    member_ship_id: number;
    price: number;
  };
  coupon_price?: number;
  extras?: ServiceExtras[];
}

export interface BookingCalculateRes {
  total_extra_price?: number;
  price: number;
  coupon_price: number;
  total_commission_fee: number;
  total_discount: number;
  total_gift_cart_price: number;
  total_price: number;
  total_service_fee: number;
  items: {
    errors?: string[];
  }[];
  status: boolean;
}

export interface BookingReviewFormValues {
  rating: number;
  comment: string;
  cleanliness?: boolean;
  masters?: boolean;
  location?: boolean;
  price?: boolean;
  interior?: boolean;
  service?: boolean;
  communication?: boolean;
  equipment?: boolean;
}

export interface BookingBookingPay {
  booking_id: number;
}
