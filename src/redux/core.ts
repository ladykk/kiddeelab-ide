import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type State = {
  isFetchInitial: boolean;
  isInstalled: boolean;
  platformLists: Array<string>;
  isVerify: boolean;
  isVerifying: boolean;
  isUpload: boolean;
  isUploading: boolean;
  uploadTimestamp: Date | null;
};

const initialState: State = {
  isFetchInitial: false,
  isInstalled: false,
  platformLists: [],
  isVerify: false,
  isVerifying: false,
  isUpload: false,
  isUploading: false,
  uploadTimestamp: null,
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
    setVerifying: (state) => {
      return { ...state, isVerifying: true };
    },
    setVerify: (state, action: PayloadAction<boolean>) => {
      return { ...state, isVerify: action.payload, isVerifying: false };
    },
    setUploading: (state) => {
      return { ...state, isUploading: true };
    },
    setUpload: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isUpload: action.payload,
        isUploading: false,
        uploadTimestamp: action.payload ? new Date() : state.uploadTimestamp,
      };
    },
  },
});

export const {
  setFetchInitial,
  setIsInstall,
  setPlatformLists,
  setVerifying,
  setVerify,
  setUploading,
  setUpload,
} = slice.actions;
export default slice.reducer;

export const selectCore = (state: RootState) => state.core;
