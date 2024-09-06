import { Category } from "@/types/category";
import { Translation } from "@/types/global";

interface CareerTranslation extends Translation {
  address?: string;
  description?: string;
}

export interface Career {
  id: number;
  category_id: number;
  location: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  translation?: CareerTranslation;
}
