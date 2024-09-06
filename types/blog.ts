import { Translation } from "./global";

export interface BlogShortTranslation extends Translation {
  short_desc: string;
}

export interface BlogFullTranslation extends BlogShortTranslation {
  description: string;
}

export interface Blog<TTranslation> {
  id: number;
  uuid: string;
  user_id: number;
  type: string;
  published_at: string;
  active: boolean;
  img: string;
  created_at: string;
  updated_at: string;
  translation: TTranslation | null;
  r_avg?: number;
  r_count?: number;
  r_sum?: number;
}
