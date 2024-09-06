import { Currency, Payment } from "@/types/global";
import { UserDetail } from "@/types/user";
import { Transaction } from "@/types/order";
import { Review } from "@/types/review";

export interface ParcelType {
  type: string;
  id: number;
}

export interface ParcelFormValues {
  type: ParcelType;
  payment: Payment;
  phone_from: string;
  username_from: string;
  address_from: string;
  location_from: {
    lat: number;
    lng: number;
  };
  house_from?: string;
  stage_from?: string;
  room_from?: string;
  phone_to: string;
  username_to: string;
  address_to: string;
  location_to: {
    lat: number;
    lng: number;
  };
  house_to?: string;
  stage_to?: string;
  room_to?: string;
  delivery_date_time: string;
  note?: string;
  description?: string;
  instructions?: string;
  notify: boolean;
  qr_value?: string;
}

export interface ParcelCreateBody {
  currency_id?: number;
  type_id?: string;
  rate?: number;
  phone_from: string;
  username_from: string;
  address_from: {
    latitude: number;
    longitude: number;
    address: string;
    house?: string;
    stage?: string;
    room?: string;
  };
  phone_to: string;
  username_to: string;
  address_to: {
    latitude: number;
    longitude: number;
    address: string;
    house?: string;
    stage?: string;
    room?: string;
  };
  delivery_date: string;
  note?: string;
  images?: string[];
  description?: string;
  instructions?: string;
  notify: number;
  qr_value?: string;
  payment_id?: number;
}

export interface ParcelAddress {
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ParcelResAddress {
  latitude: string;
  longitude: string;
  address: string;
  house?: string;
  stage?: string;
  room?: string;
}

export interface Parcel {
  id: number;
  user_id: number;
  rate: number;
  note?: string;
  status: string;
  address_from?: ParcelResAddress;
  address_to?: ParcelResAddress;
  delivery_date: string;
  delivery_time: string;
  phone_from: string;
  username_from: string;
  phone_to: string;
  username_to: string;
  current: boolean;
  img?: string;
  created_at: string;
  updated_at: string;
  currency?: Currency;
  user?: UserDetail;
  transaction?: Transaction;
  deliveryman?: UserDetail;
  type?: ParcelType;
  total_price?: number;
  review: Review | null;
}

export interface ParcelPaymentBody {
  parcel_id: number;
}
