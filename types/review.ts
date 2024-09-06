import { UserDetail } from "@/types/user";
import { ProductGallery } from "./product";

export interface ReviewRating {
  cleanliness: number;
  masters: number;
  location: number;
  price: number;
  interior: number;
  service: number;
  communication: number;
  equipment: number;
}

export interface ReviewGroupRating {
  avg: number | null;
  count: number | null;
  group: Record<number, number>;
}

export interface ReviewCreateFormValues {
  comment: string;
  rating: number;
  images?: string[];
  cleanliness?: boolean;
  masters?: boolean;
  location?: boolean;
  price?: boolean;
  interior?: boolean;
  service?: boolean;
  communication?: boolean;
  equipment?: boolean;
}

export interface ReviewCreateBody extends ReviewCreateFormValues {
  type: string;
}

export interface ReviewPermission {
  added_review: boolean;
  ordered: boolean;
}

export interface Review {
  id: number;
  user: UserDetail;
  rating: number;
  comment: string;
  img: string | null;
  created_at: string;
  updated_at: string;
  galleries?: ProductGallery[];
  communication?: boolean;
  price?: boolean;
  interior?: boolean;
  cleanliness?: boolean;
  masters?: boolean;
  location?: boolean;
  service?: boolean;
  equipment?: boolean;
}
