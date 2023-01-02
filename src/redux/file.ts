import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type State = string;

const initialState: State = "";

const slice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<string | undefined>) => {
      return action.payload ?? "";
    },
  },
});

export const { setFile } = slice.actions;
export default slice.reducer;

export const selectFile = (state: RootState) => state.file;
