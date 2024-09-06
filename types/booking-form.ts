import { Translation } from "@/types/global";

export interface FormOption {
  required: number;
  answer_type: string;
  question: string;
  answer?: string[];
  user_answer?: string[];
}

export interface BookingForm {
  required: number;
  id: number;
  translation: Translation | null;
  service_master_id: number;
  data?: FormOption[];
}
