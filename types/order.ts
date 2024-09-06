import { Currency, DeliveryPoint, DeliveryPrice, Payment } from "@/types/global";
import { Shop } from "@/types/shop";
import { Address } from "@/types/address";
import { IUser } from "@/types/user";
import { CartDetailProduct } from "@/types/cart";
import { Coupon } from "@/types/product";

export interface OrderCreateBody {
  cart_id?: number;
  currency_id?: number;
  rate?: number;
  delivery_date: string;
  delivery_type: string;
  delivery_point_id?: number;
  delivery_price_id?: number;
  address_id?: number;
  notes?: {
    order?: Record<number, string | undefined>;
    product?: Record<number, string | undefined>;
  };
  payment_id?: number;
  coupon?: Record<number, string | undefined>;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  shop_id: number;
  commission_fee: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  shop: Shop;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  delivery_price_id?: number;
  currency_id: number;
  status: string;
  total_price: number;
  delivery_fee?: number;
  total_tax: number;
  origin_price: number;
  rate: number;
  delivery_date: string;
  delivery_type: string;
  order_details_count: number;
  created_at: string;
  updated_at: string;
  currency: Currency;
  details: OrderDetail[];
  total_discount?: number;
  total_shop_tax?: number;
  service_fee: number;
  shop: Shop;
  tax?: number;
}

export interface Refund {
  answer?: string;
  cause?: string;
  id: number;
  order: Order;
  status?: "pending" | "accepted" | "canceled";
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  status: string;
  note: string;
  payable_id: number;
  price: number;
  status_description: string;
  payment_system: Payment;
}

export interface OrderNoteItem {
  created_at: string;
  title: Record<string, string>;
}

export interface OrderNote {
  id: number;
  order_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  notes: OrderNoteItem[];
}

export interface OrderFull extends Omit<Order, "details"> {
  delivery_point: DeliveryPoint | null;
  my_address: Address | null;
  deliveryPrice: DeliveryPrice | null;
  deliveryman: IUser | null;
  transaction: Transaction | null;
  details: CartDetailProduct[];
  note?: string;
  order_refunds: Refund[];
  user: IUser;
  coupon?: Coupon;
  parent_id?: number;
  track_name?: string;
  track_id?: string;
  track_url?: string;
  notes: OrderNote[];
}

export interface RefundCreateBody {
  cause: string;
  order_id?: number;
}
