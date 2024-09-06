import { Story } from "@/types/story";
import { storyTiming } from "@/config/global";
import { useSwiper } from "swiper/react";
import { Button } from "@/components/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCountDown } from "@/hook/use-countdown";
import { StoryLine } from "./story-line";
import { StoryHeader } from "./story-header";
import { SingleStory } from "./story";
import { useStories } from "./stories.provider";
import { Types } from "./stories.reducer";

interface SubStoriesProps {
  stories: Story[];
  onCloseModal: () => void;
  mainStoriesLength: number;
}

export const SubStories = ({ stories, onCloseModal, mainStoriesLength }: SubStoriesProps) => {
  const { t } = useTranslation();
  const mainSwiper = useSwiper();
  const { dispatch, state } = useStories();
  const { counter: time, reset, start } = useCountDown(storyTiming);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSwipeNext = () => {
    if (state.sub < stories.length - 1) {
      dispatch({ type: Types.ChangeSubStoryIndex, payload: state.sub + 1 });
    } else if (mainStoriesLength > mainSwiper?.realIndex) {
      mainSwiper?.slideNext();
      dispatch({ type: Types.ChangeMainStoryIndex, payload: state.main + 1 });
    } else if (mainStoriesLength === mainSwiper?.realIndex) {
      dispatch({ type: Types.ToggleModal, payload: { storyIndex: -1 } });
    }
  };

  const handleSwipePrev = () => {
    if (state.sub > 0 && stories.length !== 1) {
      dispatch({ type: Types.ChangeSubStoryIndex, payload: state.sub - 1 });
      reset();
    } else if (mainStoriesLength >= mainSwiper?.realIndex) {
      mainSwiper?.slidePrev();
      dispatch({ type: Types.ChangeMainStoryIndex, payload: state.main - 1 });
    }
  };

  useEffect(() => {
    if (imageLoaded) {
      start();
    }
  }, [state.main, state.sub, imageLoaded]);

  useEffect(() => {
    if (!time) {
      handleSwipeNext();
      reset();
    }
  }, [time]);

  return (
    <>
      <div className="flex items-center gap-2.5 absolute top-0 left-0 w-full z-10 p-2">
        {Array.from(Array(stories.length).keys()).map((step, idx) => (
          <StoryLine
            time={time}
            lineIdx={idx}
            key={step}
            currentIdx={state.sub}
            isBefore={state.sub > idx}
          />
        ))}
      </div>
      <StoryHeader story={stories[0]} onClose={onCloseModal} />
      <SingleStory data={stories[state.sub]} onLoad={() => setImageLoaded(true)} />

      <button
        className="h-4/5 flex-1 w-1/2 absolute bottom-0 left-0 z-10 "
        aria-label="prev"
        onClick={handleSwipePrev}
      />
      <button
        className="h-4/5 flex-1 w-1/2 absolute bottom-0 right-0 z-10 "
        aria-label="next"
        onClick={handleSwipeNext}
      />
      <div className="absolute z-10 w-full bottom-0 left-0 p-2">
        <Button
          as={Link}
          onClick={onCloseModal}
          href={
            stories[0].product_uuid
              ? `/products/${stories[0].product_uuid}`
              : `/shops/${stories[0].shop_slug}`
          }
          fullWidth
        >
          {t("view.product")}
        </Button>
      </div>
    </>
  );
};
