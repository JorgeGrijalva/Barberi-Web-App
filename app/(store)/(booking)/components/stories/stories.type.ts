import { Story } from "@/types/story";
import { StoriesActions } from "./stories.reducer";

export interface IConfig {
  userName?: string;
  userId?: number;
}

export interface IStoriesConfig {
  userId: number;
  currentStories: string[];
  currentStory: string;
  loading: boolean;
  timing: number;
  startTiming: number;
  userName?: string;
}

export interface StoriesPayload {
  type: string;
  content?: unknown;
  config?: IConfig | IStoriesConfig;
}

export interface startStoryTransitionProps {
  currentStoryIndex: number;
  currentStories: Story[];
  shopId: number | null;
  storiesDispatch: React.Dispatch<StoriesActions> | null;
  dispatch: React.Dispatch<StoriesActions> | null;
  timing?: number;
  inPause?: boolean;
  setInPause?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface INextPrevStory {
  direction: "left" | "right";
  userId: number;
  currentStories: Story[];
  currentStory: Story | null;
  storiesDispatch: React.Dispatch<StoriesActions> | null;
  dispatch: React.Dispatch<StoriesActions> | null;
}

export interface IStoriesContext {
  modal: {
    status: boolean;
    shopId: number | null;
  };
  userId: number;
  currentStories: Story[];
  currentStory: Story | null;
  loading: boolean;
  timing: number;
  startTiming: number;
  userName?: string;
}
