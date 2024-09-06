import { City, Country, Region } from "@/types/global";

export interface AddressCreateBody {
  additional_details?: string;
  firstname: string;
  lastname: string;
  phone: string;
  street_house_number: string;
  zipcode: string;
  country_id?: number;
  region_id?: number;
  city_id?: number;
}

export interface Address {
  id: number;
  user_id: number;
  active: boolean | null;
  firstname: string;
  lastname: string;
  phone: string;
  zipcode: string;
  street_house_number: string;
  additional_details: string;
  created_at: string;
  updated_at: string;
  city: City | null;
  country: Country | null;
  region: Region | null;
  location?: {
    address: string;
    latitude: string;
    longitude: string;
  };
}
