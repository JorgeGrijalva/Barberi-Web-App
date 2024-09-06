import { Translation } from "@/types/global";
import { Shop } from "./shop";
import { Service } from "./service";

interface MembershipTranslation extends Translation {
  term: string;
  description: string;
}

export interface Membership {
  id: number;
  shop_id: number;
  time: string;
  translation: MembershipTranslation | null;
  services_count: number;
  sessions: number;
  sessions_count: number;
  price: number;
  color: string;
  remainderSessions?: number;
}

export interface MembershipDetail extends Membership {
  shop?: Shop;
  services: [{ member_ship_id?: number; service?: Service }];
}

export type MembershipBase = MembershipDetail;

export interface UserMembership {
  id: number;
  member_ship: MembershipBase;
  remainder: number;
  expired_at: string;
  sessions: number;
}
