import Image from "next/image";
import { CartDetailProduct } from "@/types/cart";
import { Price } from "@/components/price";
import clsx from "clsx";
import Link from "next/link";
import { unitify } from "@/utils/unitify";
import { useTranslation } from "react-i18next";
import ArrowDownLineIcon from "remixicon-react/ArrowDownLineIcon";

export const CheckoutProduct = ({
  data,
  noteMode,
}: {
  data: CartDetailProduct;
  noteMode?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(
        data.replace_stock?.product &&
          "p-2 border-2 border-gray-border dark:border-gray-inputBorder rounded-2xl"
      )}
    >
      {data?.replace_stock?.product && (
        <div>
          <span className="text-xs">{t("old.product")}</span>
          <div
            className={clsx(
              "flex items-center gap-2",
              data.replace_stock?.product && "border-2 border-red rounded-2xl p-1"
            )}
          >
            <Image
              src={data.galleries?.[0]?.path || data.replace_stock?.product?.img}
              alt={data.replace_stock?.product?.translation?.title || "product"}
              width={76}
              height={76}
              className="object-contain rounded-2xl w-14 h-14"
            />
            <div>
              <Link
                className="text-sm font-medium"
                href={`/products/${data?.replace_stock?.product?.uuid}`}
              >
                {data.replace_stock?.product?.translation?.title}
              </Link>
              <div className="flex items-center gap-2">
                <strong className={clsx(noteMode ? "text-base" : "text-sm", "font-bold")}>
                  <Price number={data?.replace_stock.price || data?.replace_stock.total_price} />
                </strong>
                {!noteMode && (
                  <>
                    x
                    {!!data.replace_quantity && (
                      <strong className="text-sm font-bold">
                        {unitify(data?.replace_quantity, data?.replace_stock?.product?.interval)}
                      </strong>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {data.replace_stock?.product && (
        <div className="flex justify-center my-2">
          <div className="border border-gray-border dark:border-gray-inputBorder rounded-2xl p-2">
            <ArrowDownLineIcon />
          </div>
        </div>
      )}
      <div>
        {data.replace_stock?.product && <span className="text-xs">{t("replaced.product")}</span>}
        <div
          className={clsx(
            "flex items-center gap-2",
            data.replace_stock?.product && "border-2 border-green rounded-2xl p-1"
          )}
        >
          <Image
            src={data.galleries?.[0]?.path || data.stock?.product?.img}
            alt={data.stock?.product?.translation?.title || "product"}
            width={76}
            height={76}
            className="object-contain rounded-2xl w-14 h-14"
          />
          <div>
            <Link className="text-sm font-medium" href={`/products/${data?.stock?.product?.uuid}`}>
              {data.stock?.product?.translation?.title} {data.bonus && <span>({t("bonus")})</span>}
            </Link>
            <div className="flex items-center gap-2">
              <strong className={clsx(noteMode ? "text-base" : "text-sm", "font-bold")}>
                <Price
                  number={
                    data?.price ??
                    data?.stock?.total_price ??
                    data?.stock?.price ??
                    data?.total_price
                  }
                />
              </strong>
              {!noteMode && (
                <>
                  x
                  <strong className="text-sm font-bold">
                    {unitify(data?.quantity, data?.stock?.product?.interval)}
                  </strong>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {data.replace_stock?.product && data.replace_note && (
        <div className="mt-2">
          <span className="text-sm">{t("note")}:</span>{" "}
          <span className="text-sm italic">{data?.replace_note}</span>
        </div>
      )}
    </div>
  );
};
