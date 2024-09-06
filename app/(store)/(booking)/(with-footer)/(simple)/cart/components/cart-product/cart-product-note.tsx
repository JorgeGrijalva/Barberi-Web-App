import { CartDetailProduct } from "@/types/cart";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { CheckoutProduct } from "@/components/checkout-product";
import { useCheckout } from "@/context/checkout/checkout.context";
import { Types } from "@/context/checkout/checkout.reducer";

const CartProductNote = ({ data, onSave }: { data: CartDetailProduct; onSave: () => void }) => {
  const { t } = useTranslation();
  const { dispatch, state } = useCheckout();
  const [note, setNote] = useState(state.notes?.[data.stock.id] || "");

  const handleSaveNote = () => {
    dispatch({ type: Types.UpdateProductNote, payload: { stockId: data.stock.id, note } });
    onSave();
  };
  return (
    <div className="md:px-5 py-5 px-2">
      <h5 className="text-[22px] font-semibold">{t("comment.for.product")}</h5>
      <div className="mt-10 mb-2">
        <CheckoutProduct data={data} noteMode />
      </div>
      <textarea
        className="outline-none focus-ring border border-gray-inputBorder w-full rounded-2xl bg-transparent resize-none p-5 mb-10"
        placeholder={t("comment.for.order.product")}
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button onClick={handleSaveNote} fullWidth>
        {t("save")}
      </Button>
    </div>
  );
};

export default CartProductNote;
