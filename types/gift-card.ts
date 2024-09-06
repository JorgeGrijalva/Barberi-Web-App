import { Translation } from "@/types/global";

interface GiftCartTranslation extends Translation {
  term: string;
  description: string;
}

export interface GiftCart {
  id: number;
  shop_id: number;
  time: string;
  translation: GiftCartTranslation | null;
  services_count: number;
  sessions: number;
  sessions_count: number;
  price: number;
  color: string;
  shopGiftCartId: number;
  user_gift_cart_id: number;
}

export interface UserGiftCart {
  expired_at: string;
  price: number;
  id: number;
  giftCart: GiftCart;
}
