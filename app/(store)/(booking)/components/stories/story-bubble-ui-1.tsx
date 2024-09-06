import { Story } from "@/types/story";
import Image from "next/image";
import { useStories } from "./stories.provider";
import { Types } from "./stories.reducer";

interface StoryBubbleProps {
  stories: Story[];
  isPost?: boolean;
  storyIndex: number;
}

export const StoryBubbleUi1 = ({ stories, isPost, storyIndex }: StoryBubbleProps) => {
  const { dispatch } = useStories();
  const handleClick = () => {
    dispatch({
      type: Types.ToggleModal,
      payload: { storyIndex },
    });
  };

  return (
    <button
      className="aspect-[1/2] rounded-button relative overflow-hidden w-[173px]"
      onClick={!isPost ? handleClick : () => null}
    >
      <div className="absolute z-[1] top-1 left-2.5 right-2.5">
        <div className="flex items-center gap-1">
          {Array.from(Array(stories.length).keys()).map((item) => (
            <div className="h-px flex-1 bg-white rounded-full shadow-storeCard" key={item} />
          ))}
        </div>
        <div className="w-10 h-10 rounded-button border border-white flex items-center justify-center mt-1 bg-white bg-opacity-60">
          <Image
            src={stories?.[0]?.logo_img || ""}
            alt="story"
            width={28}
            height={28}
            quality={100}
            className="rounded-full w-7 h-7 object-cover"
          />
        </div>
      </div>
      <Image
        src={stories?.[0].url}
        alt={stories?.[0].product_title || ""}
        fill
        className="w-full h-full object-cover"
      />
    </button>
  );
};
