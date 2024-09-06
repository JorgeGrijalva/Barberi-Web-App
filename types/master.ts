import { UserDetail } from "@/types/user";
import { Shop } from "@/types/shop";
import { Service, ServiceExtras } from "@/types/service";
import { Translation } from "@/types/global";

interface MasterInvite {
  id: number;
  role: string | null;
  shop_id: number;
  user_id: number;
  status: string;
  shop: Shop | null;
}

interface ServiceMaster {
  extras: ServiceExtras[] | [];
  active: boolean;
  commision_fee: number;
  created_at: string;
  discount: number;
  price: number;
  id: number;
  interval: number;
  master_id: number;
  pause: number;
  service_id: number;
  shop_id: number;
  total_price: number;
  updated_at: string;
  type: string;
  service?: Service;
}

export interface Master extends UserDetail {
  r_avg?: number;
  service_min_price: number;
  invite: MasterInvite | null;
  service_master: ServiceMaster | null;
  translation: Translation | null;
  service_masters?: ServiceMaster[];
}
