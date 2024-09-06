"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { InitialStateType, StoriesActions, storiesReducer } from "./stories.reducer";

const initialState: InitialStateType = {
  main: -1,
  sub: -1,
};

const StoriesContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<StoriesActions>;
}>({ state: initialState, dispatch: () => null });

const StoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(storiesReducer, initialState);
  const memoizedValue = useMemo(() => ({ state, dispatch }), [state]);
  return <StoriesContext.Provider value={memoizedValue}>{children}</StoriesContext.Provider>;
};

export default StoriesProvider;
export const useStories = () => {
  const storiesContext = useContext(StoriesContext);

  if (!storiesContext) {
    throw new Error("useStories has to be used within <StoriesContext.Provider>");
  }

  return storiesContext;
};
