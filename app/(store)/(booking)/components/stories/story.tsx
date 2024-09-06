import { Story } from "@/types/story";
import { ImageWithFallBack } from "@/components/image";
import { memo } from "react";

export const SingleStory = memo(({ data, onLoad }: { data: Story; onLoad: () => void }) => (
  <div className="relative h-full">
    <div className="absolute w-full z-[3] h-full bg-gradient-to-t from-transparent from-90% to-gray-darkSegment" />
    <div className="h-full sm:w-full w-screen">
      <ImageWithFallBack
        src={data.url}
        fill
        className="w-auto object-contain"
        alt={data.product_title}
        onLoad={() => onLoad()}
      />
    </div>
  </div>
));
