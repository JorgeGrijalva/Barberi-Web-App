import HeartIcon from "@/assets/icons/heart";
import InfoIcon from "@/assets/icons/info";
import ListIcon from "@/assets/icons/list";
import MessageIcon from "@/assets/icons/message";
import OperatorIcon from "@/assets/icons/operator";
import ProfileIcon from "@/assets/icons/profile";
import SettingIcon from "@/assets/icons/setting";
import ShopIcon from "@/assets/icons/shop";
import CompareIcon from "@/assets/icons/compare";
import Store3LineIcon from "remixicon-react/Store3LineIcon";
import ListUnorderedIcon from "remixicon-react/ListUnorderedIcon";
import Refund2LineIcon from "remixicon-react/Refund2LineIcon";
import DigitalProductIcon from "remixicon-react/File3LineIcon";
import HeartOutlinedIcon from "@/assets/icons/heart-outlined";
import UserReceivedLineIcon from "remixicon-react/UserReceivedLineIcon";
import TruckIcon from "@/assets/icons/truck";
import TeamLineIcon from "remixicon-react/TeamLineIcon";
import VoucherIcon from "@/assets/icons/vouchers";
import GiftCardIcon from "@/assets/icons/gift-card";

const links = [
  {
    title: "information",
    children: [
      {
        title: "my.account",
        path: "/profile",
        icon: <ProfileIcon />,
        requireAuth: true,
      },
      {
        title: "be.seller",
        path: "/be-seller",
        icon: <ShopIcon />,
        requireAuth: true,
      },
      {
        title: "delivery.location",
        path: "/delivery-location",
        icon: <TruckIcon size={20} />,
        requireAuth: false,
      },
      {
        title: "order.history",
        path: "/orders",
        icon: <ListIcon />,
        requireAuth: true,
      },
      {
        title: "order.refunds",
        path: "/order-refunds",
        icon: <Refund2LineIcon />,
        requireAuth: true,
      },
      {
        title: "parcel.checkout",
        path: "/parcel-checkout",
        icon: <Store3LineIcon size={20} />,
        requireAuth: true,
      },
      {
        title: "parcels",
        path: "/parcels",
        icon: <ListUnorderedIcon size={20} />,
        requireAuth: true,
      },
      {
        title: "digital.products",
        path: "/digital",
        icon: <DigitalProductIcon size={20} />,
        requireAuth: true,
      },
      {
        title: "my.wishlist",
        path: "/liked-products",
        icon: <HeartIcon size={20} />,
        requireAuth: false,
      },
      {
        title: "favorite.salons",
        path: "/liked-shops",
        icon: <HeartIcon size={20} />,
        requireAuth: false,
      },
      {
        title: "favorite.masters",
        path: "/liked-masters",
        icon: <HeartOutlinedIcon size={22} />,
        requireAuth: false,
      },
      {
        title: "memberships",
        path: "/memberships",
        icon: <VoucherIcon size={22} />,
        requireAuth: true,
      },
      {
        title: "gift.cards",
        path: "/gift-cards",
        icon: <GiftCardIcon size={22} />,
        requireAuth: true,
      },
      {
        title: "compare",
        path: "/compare",
        icon: <CompareIcon />,
        requireAuth: false,
      },
      {
        title: "blog",
        path: "/blogs",
        icon: <MessageIcon />,
        requireAuth: false,
      },
      {
        title: "group.order",
        path: "/group",
        scroll: false,
        icon: <TeamLineIcon />,
        requireAuth: true,
        checkForSetting: true,
        settingsKey: "group_order",
      },
      {
        title: "referrals",
        path: "/referrals",
        scroll: true,
        icon: <UserReceivedLineIcon />,
        requireAuth: true,
        settingsKey: "referral_active",
        checkForSetting: true,
      },
    ],
  },
  {
    title: "setting",
    children: [
      {
        title: "app.setting",
        path: "/settings",
        icon: <SettingIcon />,
        requireAuth: false,
      },
      {
        title: "hotline",
        path: "/hotline",
        icon: <OperatorIcon />,
        requireAuth: false,
      },
      {
        title: "help",
        path: "/faq",
        requireAuth: false,
        icon: <InfoIcon />,
      },
    ],
  },
];

export default links;
