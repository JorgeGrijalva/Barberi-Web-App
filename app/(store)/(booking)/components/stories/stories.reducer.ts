export type InitialStateType = {
  main: number;
  sub: number;
};
type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  ToggleModal = "TOGGLE_MODAL",
  ChangeMainStoryIndex = "CHANGE_MAIN_STORY_INDEX",
  ChangeSubStoryIndex = "CHANGE_SUB_STORY_INDEX",
}

type StoriesActionPayload = {
  [Types.ToggleModal]: {
    storyIndex: number;
  };
  [Types.ChangeMainStoryIndex]: number;
  [Types.ChangeSubStoryIndex]: number;
};

export type StoriesActions = ActionMap<StoriesActionPayload>[keyof ActionMap<StoriesActionPayload>];

export const storiesReducer = (
  state: InitialStateType,
  action: StoriesActions
): InitialStateType => {
  switch (action.type) {
    case Types.ToggleModal:
      return {
        ...state,
        main: action.payload.storyIndex,
        sub: 0,
      };
    case Types.ChangeMainStoryIndex:
      return {
        ...state,
        main: action.payload,
      };
    case Types.ChangeSubStoryIndex:
      return {
        ...state,
        sub: action.payload,
      };

    default:
      return state;
  }
};
