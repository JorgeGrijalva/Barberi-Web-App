import React, { useMemo } from "react";
import { storyTiming } from "@/config/global";
import clsx from "clsx";

interface StoryLineProps {
  time: number;
  lineIdx: number;
  currentIdx: number;
  isBefore: boolean;
}

export const StoryLine = ({ time, lineIdx, currentIdx, isBefore }: StoryLineProps) => {
  const percentage = useMemo(() => {
    if (isBefore) {
      return 100;
    }
    return currentIdx === lineIdx ? ((storyTiming - time) * 100) / storyTiming : 0;
  }, [currentIdx, lineIdx, time, isBefore]);

  return (
    <div className="bg-white rounded-full h-0.5 relative flex-1">
      <div
        className={clsx(
          "bg-primary absolute top-0 left-0 h-full ",
          percentage <= 100 &&
            percentage > 0 &&
            currentIdx === lineIdx &&
            "transition-all  ease-linear duration-[1s]"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
