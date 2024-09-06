"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import dynamic from "next/dynamic";
import { Story } from "@/types/story";
import { StoryPortal } from "./stories-portal";
import StoriesProvider from "./stories.provider";

const buttons = {
  "1": dynamic(() =>
    import("./story-bubble-ui-1").then((component) => ({ default: component.StoryBubbleUi1 }))
  ),
  "2": dynamic(() =>
    import("./story-bubble").then((component) => ({ default: component.StoryBubble }))
  ),
};

interface StoriesProps {
  buttonVariant?: keyof typeof buttons;
  data?: Story[][];
}

const Stories = ({ buttonVariant = "1", data }: StoriesProps) => {
  const ButtonUi = buttons[buttonVariant];
  if (data && data.length === 0) {
    return null;
  }
  return (
    <div className="mt-4 mb-4 md:mb-2">
      <StoriesProvider>
        <Swiper slidesPerView="auto" spaceBetween={20} className="!px-4 xl:!px-0">
          {data?.map((stories, idx) => (
            <SwiperSlide className="max-w-max z-[2]" key={stories[0].shop_id}>
              <ButtonUi storyIndex={idx} stories={stories} />
            </SwiperSlide>
          ))}
        </Swiper>
        <StoryPortal stories={data} />
      </StoriesProvider>
    </div>
  );
};

export default Stories;
