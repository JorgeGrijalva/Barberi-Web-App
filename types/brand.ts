export interface Brand {
  id: number;
  uuid: string;
  title: string | null;
  active: boolean;
  img: string;
  products_count: number;
  created_at: string;
  updated_at: string;
}
