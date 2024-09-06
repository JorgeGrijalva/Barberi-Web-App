import { DeliveryPoint, DeliveryPrice, Payment } from "@/types/global";
import { Address } from "@/types/address";

export type InitialStateType = {
  deliveryType: string;
  deliveryPoint?: DeliveryPoint;
  paymentMethod?: Payment;
  deliveryDate: Date;
  deliveryAddress?: Address;
  deliveryPrice?: DeliveryPrice;
  notes: Record<number, string | undefined>;
  shopNotes: Record<number, string | undefined>;
  coupons: Record<number, string | undefined>;
};
type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  UpdateDeliveryType = "UPDATE_DELIVERY_TYPE",
  UpdateDeliveryPoint = "UPDATE_DELIVERY_POINT",
  UpdatePaymentMethod = "UPDATE_PAYMENT_METHOD",
  UpdateDeliverDate = "UPDATE_DELIVERY_DATE",
  UpdateDeliveryAddress = "UPDATE_DELIVERY_ADDRESS",
  ClearState = "CLEAR_STATE",
  UpdateProductNote = "UPDATE_PRODUCT_NOTE",
  UpdateShopNote = "UPDATE_SHOP_NOTE",
  UpdateShopCoupon = "UPDATE_SHOP_COUPON",
  DeleteShopCoupon = "DELETE_SHOP_COUPON",
}

type CheckoutActionPayload = {
  [Types.UpdateDeliveryType]: {
    type: string;
  };
  [Types.UpdateDeliveryPoint]: {
    point: DeliveryPoint;
  };
  [Types.UpdatePaymentMethod]: {
    paymentMethod: Payment;
  };
  [Types.UpdateDeliverDate]: {
    date: Date;
  };
  [Types.UpdateDeliveryAddress]: {
    address: Address;
    deliveryPrice?: DeliveryPrice;
  };
  [Types.ClearState]: {
    all: boolean;
  };
  [Types.UpdateProductNote]: {
    stockId: number;
    note?: string;
  };
  [Types.UpdateShopNote]: {
    shopId: number;
    note?: string;
  };
  [Types.UpdateShopCoupon]: {
    shopId: number;
    name?: string;
  };
  [Types.DeleteShopCoupon]: {
    shopId: number;
  };
};

export type CheckoutActions =
  ActionMap<CheckoutActionPayload>[keyof ActionMap<CheckoutActionPayload>];

export const checkoutReducer = (state: InitialStateType, action: CheckoutActions) => {
  switch (action.type) {
    case Types.UpdateDeliveryType:
      return { ...state, deliveryType: action.payload.type };
    case Types.UpdateDeliveryPoint:
      return { ...state, deliveryPoint: action.payload.point };
    case Types.UpdatePaymentMethod:
      return { ...state, paymentMethod: action.payload.paymentMethod };
    case Types.UpdateDeliverDate:
      return { ...state, deliveryDate: action.payload.date };
    case Types.UpdateDeliveryAddress:
      return {
        ...state,
        deliveryAddress: action.payload.address,
        deliveryPrice: action.payload.deliveryPrice,
      };
    case Types.UpdateProductNote: {
      return {
        ...state,
        notes: { ...state.notes, [action.payload.stockId]: action.payload.note },
      };
    }
    case Types.UpdateShopNote: {
      return {
        ...state,
        shopNotes: { ...state.shopNotes, [action.payload.shopId]: action.payload.note },
      };
    }
    case Types.UpdateShopCoupon: {
      return {
        ...state,
        coupons: { ...state.coupons, [action.payload.shopId]: action.payload.name },
      };
    }
    case Types.DeleteShopCoupon: {
      const couponsClone = { ...state.coupons };
      delete couponsClone?.[action.payload.shopId];
      return {
        ...state,
        coupons: couponsClone,
      };
    }
    case Types.ClearState:
      return {
        deliveryType: "delivery",
        deliveryPoint: undefined,
        deliveryPrice: undefined,
        deliveryAddress: undefined,
        paymentMethod: undefined,
        deliveryDate: new Date(Date.now()),
        notes: action.payload.all ? {} : state.notes,
        shopNotes: action.payload.all ? {} : state.shopNotes,
        coupons: action.payload.all ? {} : state.coupons,
      };
    default:
      return state;
  }
};
