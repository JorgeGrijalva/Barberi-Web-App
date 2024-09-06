/* eslint-disable @next/next/no-img-element */
import { ImageProps } from "next/image";
import ReactPlayer from "react-player/lazy";
import { ImageWithFallBack } from "@/components/image";
import PlayFillIcon from "remixicon-react/PlayFillIcon";
import { useState } from "react";

interface MediaRenderProps extends ImageProps {
  preview?: string;
}

export const MediaRender = ({ preview, src, className, ...otherProps }: MediaRenderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  return preview ? (
    <button className={className} onClick={() => setIsPlaying((old) => !old)}>
      <ReactPlayer
        url={src as string}
        width="100%"
        playing={isPlaying}
        height="100%"
        loop
        stopOnUnmount
        style={{ position: "relative" }}
        playIcon={
          <button className="w-20 h-20 rounded-full bg-primary bg-opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white  ring-white ring-offset-2 ring-opacity-5 ring ring-offset-transparent">
            <PlayFillIcon size={42} />
          </button>
        }
        light={<img src={preview} className={className} alt="Thumbnail" />}
      />
    </button>
  ) : (
    <ImageWithFallBack src={src} className={className} {...otherProps} />
  );
};
