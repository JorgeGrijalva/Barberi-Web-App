import { IUser } from "@/types/user";

export interface Statistics {
  notification: number;
  new_order: number;
  new_user_by_referral: number;
  status_changed: number;
  news_publish: number;
  transaction: number;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  data?: {
    id: number;
    type: string;
    status: string;
  };
  user_id: number;
  created_at: string;
  updated_at: string;
  read_at?: string;
  client?: IUser;
  model_type: string;
}
