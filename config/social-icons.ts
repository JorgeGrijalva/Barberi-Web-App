import FacebookFillIcon from "remixicon-react/FacebookFillIcon";
import InstagramFillIcon from "remixicon-react/InstagramFillIcon";
import TelegramFillIcon from "remixicon-react/TelegramFillIcon";
import YoutubeFillIcon from "remixicon-react/YoutubeFillIcon";
import SnapchatFillIcon from "remixicon-react/SnapchatFillIcon";
import WechatFillIcon from "remixicon-react/WechatFillIcon";
import WhatsappFillIcon from "remixicon-react/WhatsappFillIcon";
import TwitchFillIcon from "remixicon-react/TwitchFillIcon";
import DiscordFillIcon from "remixicon-react/DiscordFillIcon";
import PinterestFillIcon from "remixicon-react/PinterestFillIcon";
import SteamFillIcon from "remixicon-react/SteamFillIcon";
import SpotifyFillIcon from "remixicon-react/SpotifyFillIcon";
import RedditFillIcon from "remixicon-react/RedditFillIcon";
import SkypeFillIcon from "remixicon-react/SkypeFillIcon";
import TwitterFillIcon from "remixicon-react/TwitterFillIcon";
import { IconType } from "@/types/utils";
import { RemixiconReactIconComponentType } from "remixicon-react";
import TiktokIcon from "@/assets/icons/tiktok";
import ThreadsIcon from "@/assets/icons/threads";

export const socialIcons: Record<string, IconType | RemixiconReactIconComponentType> = {
  facebook: FacebookFillIcon,
  instagram: InstagramFillIcon,
  tiktok: TiktokIcon,
  telegram: TelegramFillIcon,
  youtube: YoutubeFillIcon,
  linkedin: YoutubeFillIcon,
  snapchat: SnapchatFillIcon,
  wechat: WechatFillIcon,
  whatsapp: WhatsappFillIcon,
  threads: ThreadsIcon,
  twitch: TwitchFillIcon,
  discord: DiscordFillIcon,
  pinterest: PinterestFillIcon,
  steam: SteamFillIcon,
  spotify: SpotifyFillIcon,
  reddit: RedditFillIcon,
  skype: SkypeFillIcon,
  twitter: TwitterFillIcon,
};
