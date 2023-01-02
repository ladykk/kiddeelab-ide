import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Toast } from "../types/toast";
import { RootState } from "./store";

type State = Array<Toast>;

const initialState: State = [];

const slice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Toast>) => {
      const old_index = state.findIndex((t) => t.id === action.payload.id);
      if (old_index > -1) state[old_index] = action.payload;
      else state = [action.payload, ...state];
      return state;
    },
    removeToast: (state, action: PayloadAction<string>) => {
      return state.filter((Toast) => Toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = slice.actions;
export default slice.reducer;

export const selectToasts = (state: RootState) => state.toasts;
