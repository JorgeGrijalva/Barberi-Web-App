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
      // group classname with tailwind group
      className="group aspect-[1/2] rounded-button relative overflow-hidden w-[173px]"
      onClick={!isPost ? handleClick : () => null}
    >
      <div className="absolute z-[1] top-1 left-2.5 right-2.5">
        <div className="flex items-center gap-1">
          {Array.from(Array(stories.length).keys()).map((item) => (
            <div className="h-px flex-1 bg-white rounded-full shadow-storeCard" key={item} />
          ))}
        </div>
        <div className="w-12 h-12  group-hover:border-primary transition duration-500 border-2 rounded-[50%] border-transparent flex items-center justify-center mt-1 ">
          <Image
            src={stories?.[0]?.logo_img || ""}
            alt="story"
            width={100}
            height={100}
            className="rounded-full w-12 h-12 object-cover"
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
