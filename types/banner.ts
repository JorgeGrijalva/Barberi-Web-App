import { Translation } from "./global";
import { ProductGallery } from "./product";

interface BannerTranslation extends Translation {
  button_text: string;
  description: string;
}

export interface Banner {
  active: boolean;
  clicable: number;
  created_at: string;
  updated_at: string;
  url: string;
  img: string;
  id: number;
  shop_id: number;
  products: number[];
  translation: BannerTranslation | null;
  galleries?: ProductGallery[];
  products_count: number;
}
