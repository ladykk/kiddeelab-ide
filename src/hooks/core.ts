import { useEffect, useState } from "react";
import {
  selectCore,
  setFetchInitial,
  setIsInstall,
  setPlatformLists,
} from "../redux/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { addToast, removeToast, selectToasts } from "../redux/toast";

export const useInitializeCore = function () {
  const { isFetchInitial, isInstalled } = useAppSelector(selectCore);
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      dispatch(
        addToast({
          id: "coreLoadingInitial",
          title: "Loading Arduino core",
          type: "loading",
        })
      );
      const installed = await window.core.isInstalled();
      dispatch(setIsInstall(installed));
      if (installed) {
        await window.core.updateIndex();
        const platforms = await window.core.installList();
        dispatch(setPlatformLists(platforms));
      }
      dispatch(setFetchInitial());
    })();
  }, []);

  useEffect(() => {
    if (isFetchInitial) {
      dispatch(removeToast("coreLoadingInitial"));
    }
    if (isFetchInitial && !isInstalled)
      dispatch(
        addToast({
          id: "coreNotInstalled",
          type: "failure",
          title: "Core not installed",
          message:
            "Arduino CLI is not installed on the machine. You will be able to use IDE for editing only.",
        })
      );
  }, [isFetchInitial, isInstalled]);
};
