import { Service, ServiceMasterInfo, ServiceExtras } from "@/types/service";
import { Master } from "@/types/master";
import { Payment } from "@/types/global";
import { BookingAddress } from "@/types/booking";
import { Membership } from "@/types/membership";
import { GiftCart } from "@/types/gift-card";

export interface BookingService extends Service {
  master?: Master;
  note?: string;
  membership?: Membership;
  userMemberShipId?: number;
  selected_service_extra?: ServiceExtras;
  unsupportedMastersByServices?: number[];
  selected_extra_ids?: number[];
}

export type InitialStateType = {
  services: BookingService[];
  date?: string;
  time?: string;
  payment?: Payment;
  master?: Master;
  address?: BookingAddress;
  giftCart?: GiftCart;
  giftCardForPurchase?: GiftCart;
  coupon: string | undefined;
  unsupportedMastersByServices?: number[];
  serviceMasterInfo?: ServiceMasterInfo[];
};
type ActionMap<
  M extends {
    [index: string]: unknown;
  }
> = {
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
  SelectService = "SELECT_SERVICE",
  UpdateService = "UPDATE_SERVICE",
  UnselectService = "UNSELECT_SERVICE",
  SelectMasterForService = "SELECT_MASTER_FOR_SERVICE",
  SetDate = "SET_DATE",
  SetTime = "SET_TIME",
  SetDateTime = "SET_DATE_TIME",
  ClearDateTime = "CLEAR_DATE_TIME",
  SetNote = "SET_NOTE",
  SetPayment = "SET_PAYMENT",
  SetMaster = "SET_MASTER",
  UnSetMaster = "UNSET_MASTER",
  UpdateAddress = "UPDATE_ADDRESS",
  ResetBooking = "RESET_BOOKING",
  SelectMembership = "SELECT_MEMBERSHIP",
  DeleteMemberShip = "DELETE_MEMBERSHIP",
  SetOnlyMaster = "SET_ONLY_MASTER",
  SelectGiftCart = "SELECT_GIFT_CART",
  DeleteGiftCart = "DELETE_GIFT_CART",
  DeletePayment = "DELETE_PAYMENT",
  DeleteNotes = "DELETE_NOTES",
  DeleteAddress = "DELETE_ADDRESS",
  SelectPurchaseGiftCard = "SELECT_PURCHASE_GIFTCARD",
  UpdateCoupon = "UPDATE_COUPON",
  UnsupportedMastersByServices = "UNSUPPORTED_MASTERS_BY_SERVICES",
  DeleteUnsupportedMastersByServices = "DELETE_UNSUPPORTED_MASTERS_BY_SERVICES",
}

type BookingActionPayload = {
  [Types.SelectService]: BookingService;
  [Types.UpdateService]: BookingService;
  [Types.UnselectService]: number;
  [Types.SelectMasterForService]: {
    serviceId: number;
    master: Master;
  };
  [Types.SetDate]: string;
  [Types.SetTime]: string;
  [Types.SetDateTime]: {
    date: string;
    time: string;
  };
  [Types.ClearDateTime]: undefined;
  [Types.SetNote]: {
    serviceId: number;
    note: string;
  };
  [Types.SetPayment]: Payment;
  [Types.SetMaster]: Master;
  [Types.UnSetMaster]: undefined;
  [Types.UpdateAddress]: BookingAddress;
  [Types.ResetBooking]: undefined;
  [Types.SelectMembership]: {
    serviceId: number;
    membership: Membership;
    userMembershipId: number;
  };
  [Types.DeleteMemberShip]: number;
  [Types.SetOnlyMaster]: {
    master: Master;
    serviceMasterInfo?: ServiceMasterInfo[];
  };
  [Types.UnsupportedMastersByServices]: number;
  [Types.DeleteUnsupportedMastersByServices]: undefined;
  [Types.SelectGiftCart]: GiftCart;
  [Types.DeleteGiftCart]: undefined;
  [Types.DeletePayment]: undefined;
  [Types.DeleteNotes]: undefined;
  [Types.DeleteAddress]: undefined;
  [Types.SelectPurchaseGiftCard]: GiftCart;
  [Types.UpdateCoupon]: {
    name?: string;
  };
};

export type BookingActions = ActionMap<BookingActionPayload>[keyof ActionMap<BookingActionPayload>];

export const bookingReducer = (
  state: InitialStateType,
  action: BookingActions
): InitialStateType => {
  switch (action.type) {
    case Types.SelectService:
      return {
        ...state,
        services: state.services.find((service) => service.id === action.payload.id)
          ? state.services.filter((service) => service.id !== action.payload.id)
          : [...state.services, action.payload],
      };
    case Types.UpdateService:
      return {
        ...state,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        ),
      };
    case Types.UnselectService:
      return {
        ...state,
        services: state.services.filter((service) => service.id !== action.payload),
      };
    case Types.SelectMasterForService:
      return {
        ...state,
        services: state.services.map((service) => {
          if (service.id === action.payload.serviceId) {
            return { ...service, master: action.payload.master };
          }
          return service;
        }),
      };
    case Types.SetDate:
      return {
        ...state,
        date: action.payload,
      };
    case Types.SetTime:
      return {
        ...state,
        time: action.payload,
      };
    case Types.SetDateTime:
      return {
        ...state,
        date: action.payload.date,
        time: action.payload.time,
      };
    case Types.ClearDateTime:
      return {
        ...state,
        date: undefined,
        time: undefined,
      };
    case Types.SetNote:
      return {
        ...state,
        services: state.services.map((service) => {
          if (service.id === action.payload.serviceId) {
            return { ...service, note: action.payload.note };
          }
          return service;
        }),
      };
    case Types.SetPayment:
      return {
        ...state,
        payment: action.payload,
      };
    case Types.SetMaster:
      return {
        ...state,
        master: action.payload,
        services: [],
        time: undefined,
        date: undefined,
        payment: undefined,
        address: undefined,
      };
    case Types.SetOnlyMaster:
      return {
        ...state,
        master: action.payload.master,
        services: state.services.map((service) => ({
          ...service,
          master:
            action.payload.master.service_master && action.payload.serviceMasterInfo
              ? {
                  ...action.payload.master,
                  service_master: {
                    ...action.payload.master?.service_master,
                    interval:
                      action.payload.serviceMasterInfo?.find(
                        (infoItem) => infoItem?.service_id === service.id
                      )?.interval || action.payload.master?.service_master?.interval,
                    id:
                      action.payload.serviceMasterInfo?.find(
                        (infoItem) => infoItem.service_id === service.id
                      )?.id || action.payload.master?.service_master?.id,
                  },
                }
              : action.payload.master,
        })),
      };
    case Types.UnSetMaster:
      return {
        ...state,
        master: undefined,
        services: state.services.map((service) => ({ ...service, master: undefined })),
      };
    case Types.UnsupportedMastersByServices:
      return {
        ...state,
        unsupportedMastersByServices: state?.unsupportedMastersByServices?.length
          ? [...state.unsupportedMastersByServices, action.payload]
          : [action.payload],
      };
    case Types.DeleteUnsupportedMastersByServices:
      return {
        ...state,
        unsupportedMastersByServices: undefined,
      };
    case Types.UpdateAddress:
      return {
        ...state,
        address: action.payload,
      };
    case Types.ResetBooking:
      return { services: [], coupon: undefined };
    case Types.SelectMembership:
      return {
        ...state,
        services: state.services.map((service) => {
          if (service.id === action.payload.serviceId) {
            return {
              ...service,
              membership: action.payload.membership,
              userMemberShipId: action.payload.userMembershipId,
            };
          }
          return service;
        }),
      };
    case Types.DeleteMemberShip:
      return {
        ...state,
        services: state.services.map((service) => {
          if (service.id === action.payload) {
            return { ...service, membership: undefined, userMemberShipId: undefined };
          }
          return service;
        }),
      };
    case Types.SelectGiftCart:
      return {
        ...state,
        giftCart: action.payload,
      };
    case Types.SelectPurchaseGiftCard:
      return {
        ...state,
        giftCardForPurchase: action.payload,
      };
    case Types.DeleteGiftCart:
      return {
        ...state,
        giftCart: undefined,
      };
    case Types.DeletePayment:
      return { ...state, payment: undefined };
    case Types.DeleteAddress:
      return { ...state, address: undefined };
    case Types.DeleteNotes:
      return {
        ...state,
        services: state.services.map((service) => ({
          ...service,
          note: undefined,
          membership: undefined,
        })),
      };
    case Types.UpdateCoupon: {
      return {
        ...state,
        coupon: action.payload.name,
      };
    }
    default:
      return state;
  }
};
