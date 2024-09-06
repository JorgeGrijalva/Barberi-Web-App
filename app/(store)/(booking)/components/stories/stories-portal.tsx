import React, { useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Story } from "@/types/story";
import { Dialog } from "@headlessui/react";
import { EffectCube } from "swiper/modules";
import { useStories } from "./stories.provider";
import { Types } from "./stories.reducer";
import "swiper/css/effect-cube";
import { SubStories } from "./sub-stories";

export const StoryPortal = ({ stories }: { stories?: Story[][] }) => {
  const mainSwiper = useRef<SwiperRef>(null);
  const { dispatch, state } = useStories();
  const handleCloseModal = () => {
    dispatch({ type: Types.ToggleModal, payload: { storyIndex: -1 } });
  };
  return (
    <Dialog open={state.main >= 0} unmount onClose={handleCloseModal} className="relative z-50">
      <div className="fixed inset-0 sm:bg-black/80 bg-black" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4">
        <Dialog.Panel className="sm:max-w-lg w-full h-full md:max-h-[900px]">
          <Swiper
            ref={mainSwiper}
            effect="cube"
            initialSlide={state.main}
            className="max-w-lg h-full"
            slidesPerView={1}
            modules={[EffectCube]}
            onSlideChange={() =>
              dispatch({
                type: Types.ChangeSubStoryIndex,
                payload: 0,
              })
            }
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            watchSlidesProgress
          >
            {stories?.map((storiesItem) => (
              <SwiperSlide className="h-full" key={storiesItem[0].url}>
                {({ isActive }) =>
                  isActive &&
                  storiesItem[state.sub] &&
                  mainSwiper.current && (
                    <SubStories
                      onCloseModal={handleCloseModal}
                      stories={storiesItem}
                      mainStoriesLength={stories ? stories.length - 1 : 0}
                    />
                  )
                }
              </SwiperSlide>
            ))}
          </Swiper>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
