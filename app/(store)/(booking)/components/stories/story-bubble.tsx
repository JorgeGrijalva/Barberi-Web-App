import { Story } from "@/types/story";
import Image from "next/image";
import { useStories } from "./stories.provider";
import { Types } from "./stories.reducer";

interface StoryBubbleProps {
  stories: Story[];
  isPost?: boolean;
  width?: string;
  height?: string;
  storyIndex: number;
}

export const StoryBubble = ({
  stories,
  isPost,
  width = "w-16",
  height = "h-16",
  storyIndex,
}: StoryBubbleProps) => {
  const { dispatch } = useStories();
  const handleClick = () => {
    dispatch({
      type: Types.ToggleModal,
      payload: { storyIndex },
    });
  };

  return (
    <button
      className={`flex items-center ${!isPost && "flex-col cursor-pointer"}`}
      onClick={!isPost ? handleClick : () => null}
    >
      <div
        className={`${width} ${height} gradient rounded-full p-[2px] mb-1 ${isPost && "mr-2"} ${
          !isPost && "md:w-32 md:h-32 h-24 w-24"
        }`}
      >
        <div className="w-full h-full bg-white dark:bg-darkBg rounded-full overflow-hidden relative">
          <Image
            src={stories?.[0]?.logo_img || ""}
            alt={stories?.[0].product_title || ""}
            fill
            className="w-full h-full rounded-full"
          />
        </div>
      </div>

      <h3
        className={`text-sm font-bold text-center ${
          !isPost && "whitespace-nowrap text-ellipsis overflow-hidden w-16 text-xs"
        } md:w-20 md:text-md ${isPost && "md:text-lg"}`}
      >
        {stories?.[0].title}
      </h3>
    </button>
  );
};
