import { Address } from "@/types/address";
import { Shop } from "./shop";
import { Transaction as MoneyTransaction } from "./order";

export interface IUser {
  id: number;
  uuid: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  email_verified_at: string;
  registered_at: string;
  active: boolean;
  role: string;
  img: string;
}

export interface IWallet {
  created_at: string;
  price: number;
  symbol: string;
  updated_at: string;
  user_id: number;
  uuid: string;
  id: number;
}

export interface NotificationSetting {
  notification_id: number;
  active: number;
}

export interface UserNotification {
  id: number;
  type: string;
  payload: unknown | null;
  notification: NotificationSetting;
}

export interface UserDetail extends IUser {
  img: string;
  wallet: IWallet | null;
  shop: Shop | null;
  addresses?: Address[];
  point: {
    user_id: number;
    price: string;
  };
  notifications: UserNotification[];
  referral_from_topup_price?: number;
  referral_from_topup_count?: number;
  my_referral?: string;
}

export interface SignInCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface SignUpCredentials {
  email?: string;
  phone?: string;
  password: string;
  referral?: string;
  password_confirmation?: string | null;
  type?: string;
  id?: string;
}

export interface SignInResponse {
  access_token: string;
  token_type: string;
  user: UserDetail;
}

export interface SocialLoginCredentials {
  type: "google" | "facebook" | "apple";
  data: {
    name: string | null;
    email: string | null;
    id: string;
    avatar: string | null;
  };
}

export interface UpdateProfileFormValues {
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
}

export interface UpdateProfileBody {
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  images?: string[];
}

export interface PasswordUpdateBody {
  old_password?: string;
  password: string;
  password_confirmation?: string | null;
}

export interface NotificationUpdateBody {
  notifications: NotificationSetting[];
}

export interface Transaction {
  id: number;
  type: string;
  uuid: string;
  author: UserDetail | null;
  user: UserDetail | null;
  price: number;
  status: string;
  note: string;
  created_at: string;
  updated_at: string;
  transaction: MoneyTransaction | null;
}

export interface SearchedUser {
  firstname: string;
  id: number;
  uuid: string;
  active: boolean;
  empty_p: boolean;
}

export interface WalletTopupBody {
  wallet_id?: number;
  total_price: number;
  currency_id?: number;
}

export interface MembershipPayBody {
  member_ship_id?: number;
  total_price?: number;
  currency_id?: number;
}

export interface GiftCartPayBody {
  gift_cart_id?: number;
  total_price?: number;
  currency_id?: number;
}
