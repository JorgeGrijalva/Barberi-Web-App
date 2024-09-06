import { Shop } from "@/types/shop";
import { ShopCard } from "@/components/shop-card-mini";

interface ShopInfoProps {
  data: Shop;
}

export const ShopInfo = ({ data }: ShopInfoProps) => <ShopCard openOnNewPage data={data} />;
