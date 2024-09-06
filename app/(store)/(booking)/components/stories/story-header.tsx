import CrossIcon from "@/assets/icons/cross";
import { IconButton } from "@/components/icon-button";
import { Story } from "@/types/story";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";

interface StoryHeaderProps {
  story: Story;
  onClose: () => void;
}

dayjs.extend(relativeTime);

export const StoryHeader = ({ story, onClose }: StoryHeaderProps) => (
  <div className="p-2 absolute top-4 left-0 z-10 w-full">
    <div className="flex items-center justify-between ">
      <Link href={`/shops/${story.shop_slug}`}>
        <div className="flex items-center gap-2.5">
          <div className="gradient rounded-full p-0.5">
            <div className="bg-white dark:bg-dark rounded-full w-full h-full">
              <Image
                src={story.logo_img}
                alt={story.title}
                width={40}
                height={40}
                className="aspect-square rounded-full w-10 h-10 object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{story.title}</span>
            <span className="text-xs text-gray-100">{dayjs(story.created_at).fromNow()}</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2.5">
        <IconButton size="small" className="text-white" onClick={onClose}>
          <CrossIcon />
        </IconButton>
      </div>
    </div>
  </div>
);
