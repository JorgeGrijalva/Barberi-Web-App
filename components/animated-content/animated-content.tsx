import Lottie from "react-lottie";
import React from "react";

interface AnimatedContentProps {
  animationData: unknown;
  height?: number;
  width?: number;
}

const AnimatedContent = ({ animationData, height = 400, width }: AnimatedContentProps) => (
  <Lottie
    options={{
      loop: true,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        scaleMode: "contain",
      },
    }}
    height={height}
    width={width}
  />
);

export default AnimatedContent;
