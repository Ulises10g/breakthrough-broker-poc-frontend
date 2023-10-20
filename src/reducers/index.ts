import { combineReducers } from "redux";
import templateSlice from "./templateSlice";

export const reducer = combineReducers({
  templateLogs: templateSlice
});

export type RootState = ReturnType<typeof reducer>;

