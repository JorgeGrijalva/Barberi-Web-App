import { Location, SearchPrediction } from "@/types/global";
import { Category } from "@/types/category";

interface SearchCategory {
  categoryId?: string;
  data?: Category;
  query?: string;
}

interface SearchLocation {
  query?: string;
  geolocation?: Location;
  predictions?: SearchPrediction[];
  status: string;
  placeId?: string;
}

interface SearchDate {
  query?: string;
}

interface SearchTime {
  time: {
    from: string;
    to: string;
  } | null;
}

export type InitialStateType = {
  category: SearchCategory;
  location: SearchLocation;
  date: SearchDate;
  searchTime: SearchTime;
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
  SetCategory = "SET_CATEGORY",
  SetLocation = "SET_LOCATION",
  SetDate = "SET_DATE",
  SetTime = "SET_TIME",
  SetSearchPredictions = "SET_SEARCH_PREDICTIONS",
  SetLocationPLaceId = "SET_LOCATION_PLACE_ID",
}

type SearchActionPayload = {
  [Types.SetCategory]: Category;
  [Types.SetLocation]: Omit<SearchLocation, "predictions" | "status">;
  [Types.SetDate]: string;
  [Types.SetTime]: {
    from: string;
    to: string;
  };
  [Types.SetSearchPredictions]: Omit<SearchLocation, "query" | "geolocation">;
  [Types.SetLocationPLaceId]: string | undefined;
};

export type SearchActions = ActionMap<SearchActionPayload>[keyof ActionMap<SearchActionPayload>];

export const searchReducer = (state: InitialStateType, action: SearchActions): InitialStateType => {
  switch (action.type) {
    case Types.SetCategory:
      return {
        ...state,
        category: {
          categoryId: action.payload.id.toString(),
          query: action.payload.translation?.title || "",
          data: action.payload,
        },
      };
    case Types.SetLocation:
      return { ...state, location: { ...state.location, ...action.payload } };
    case Types.SetSearchPredictions:
      return { ...state, location: { ...state.location, ...action.payload } };
    case Types.SetDate:
      return { ...state, date: { query: action.payload } };
    case Types.SetTime:
      return { ...state, searchTime: { time: action.payload } };
    case Types.SetLocationPLaceId:
      return { ...state, location: { ...state.location, placeId: action.payload } };
    default:
      return state;
  }
};
