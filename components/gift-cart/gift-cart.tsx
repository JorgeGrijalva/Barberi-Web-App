import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { GiftCart } from "@/types/gift-card";
import { Price } from "@/components/price";
import Image from "next/image";

interface MembershipCardProps {
  data: GiftCart;
  onClick: () => void;
  isSelected?: boolean;
  index: number;
}

const cards = [
  { bg: "bg-gift_card_bg_1", color: "#9798D9" },
  { bg: "bg-gift_card_bg_2", color: "#75B16E" },
  { bg: "bg-gift_card_bg_3", color: "#E89B46" },
  { bg: "bg-gift_card_bg_4", color: "#53C9D5" },
  { bg: "bg-gift_card_bg_5", color: "#95CC82" },
];

export const GiftCartItem = ({ data, onClick, isSelected, index }: MembershipCardProps) => {
  const { t } = useTranslation();
  return (
    <button
      className={clsx(
        "aspect-[410/180] rounded-button p-3 flex flex-col justify-between w-full bg-cover bg-no-repeat",
        isSelected && "ring ring-primary ring-offset-2 rounded-button",
        cards[index % 5].bg
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <Image src="/img/gift_card.png" alt="gift_card" width={153} height={90} />
        <span className=" md:text-5xl font-semibold text-white">
          <Price number={data.price} />
        </span>
      </div>
      <div className="flex items-center justify-end">
        <span className={clsx("text-sm")} style={{ color: cards[index % 5].color }}>
          {t("valid.for")} {data.time}
        </span>
      </div>
    </button>
  );
};
