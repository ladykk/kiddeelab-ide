import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type State = {
  isFetchInitial: boolean;
  isInstalled: boolean;
  platformLists: Array<string>;
};

const initialState: State = {
  isFetchInitial: false,
  isInstalled: false,
  platformLists: [],
};

const slice = createSlice({
  name: "core",
  initialState,
  reducers: {
    setFetchInitial: (state) => {
      return { ...state, isFetchInitial: true };
    },
    setIsInstall: (state, action: PayloadAction<boolean>) => {
      return { ...state, isInstalled: action.payload };
    },
    setPlatformLists: (state, action: PayloadAction<Array<string>>) => {
      return { ...state, platformLists: action.payload };
    },
  },
});

export const { setFetchInitial, setIsInstall, setPlatformLists } =
  slice.actions;
export default slice.reducer;

export const selectCore = (state: RootState) => state.core;
