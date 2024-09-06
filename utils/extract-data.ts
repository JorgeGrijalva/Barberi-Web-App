import { Paginate } from "@/types/global";

export const extractDataFromPagination = <T>(pages?: Paginate<T>[]) =>
  pages?.reduce<T[]>((acc, curr) => acc.concat(curr.data), []);
