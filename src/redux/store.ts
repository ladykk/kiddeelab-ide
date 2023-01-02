import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import projectReducer from "./project";
import fileReducer from "./file";
import toastReducers from "./toast";
import coreReducers from "./core";

const store = configureStore({
  reducer: {
    project: projectReducer,
    file: fileReducer,
    toasts: toastReducers,
    core: coreReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
