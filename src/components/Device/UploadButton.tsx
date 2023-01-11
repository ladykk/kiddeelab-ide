import deviceLists from "../../devices";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Button, Spinner, Tooltip } from "flowbite-react";
import { useEffect } from "react";
import ArduinoGenerator, { codeFormator } from "../../blocks/arduino";
import {
  selectCore,
  setUpload,
  setUploading,
  setVerify,
  setVerifying,
} from "../../redux/core";
import { selectProject } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { removeToast, addToast } from "../../redux/toast";

export default function UploadButton({ disabled }: { disabled: boolean }) {
  const { workspace, pins, variables, functions, deviceId, port } =
    useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const { isVerify, isVerifying, isUploading, isUpload, uploadTimestamp } =
    useAppSelector(selectCore);
  const device = deviceId ? deviceLists[deviceId] : null;

  useEffect(() => {
    if (workspace) {
      if (isUploading) {
        workspace.options.readOnly = true;
      } else {
        workspace.options.readOnly = false;
      }
    }
  }, [isUploading]);

  const onClick = async () => {
    if (workspace && deviceId) {
      if (!isVerify) {
        dispatch(setVerifying());
        dispatch(removeToast("buildVerifyResult"));
        dispatch(
          addToast({
            id: "buildVerify",
            type: "loading",
            title: "Verifying project",
          })
        );
        const raw = ArduinoGenerator.workspaceToCode(workspace);
        const code = codeFormator(raw, pins, variables, functions);

        const result = await window.build.verify(deviceId, code);
        if (result.status === "success") {
          dispatch(
            addToast({
              id: "buildVerifyResult",
              type: "success",
              title: result.reason,
              message: result.output.split("[")[0],
            })
          );
          setTimeout(() => {
            dispatch(removeToast("buildVerifyResult"));
          }, 10000);
        } else {
          dispatch(
            addToast({
              id: "buildVerifyResult",
              type: "failure",
              title: result.reason,
              message: result.error.message
                .split("\n")
                .filter((s, i) => i > 0)
                .join("\n"),
            })
          );
        }
        dispatch(setVerify(result.status === "success"));
        dispatch(removeToast("buildVerify"));

        if (result.status !== "success") return;
      }

      dispatch(setUploading());
      dispatch(removeToast("buildUploadResult"));
      dispatch(
        addToast({
          id: "buildUpload",
          type: "loading",
          title: "Uploading project",
          message: device?.bootRequired
            ? `Some ${device.name} required to press BOOT button when uploading the project.`
            : undefined,
        })
      );

      const result = await window.build.upload(port, deviceId);
      if (result.status === "success") {
        dispatch(
          addToast({
            id: "buildUploadResult",
            type: "success",
            title: result.reason,
            message: "Project is uploaded to your device.",
          })
        );
        setTimeout(() => {
          dispatch(removeToast("buildUploadResult"));
        }, 10000);
      } else {
        dispatch(
          addToast({
            id: "buildUploadResult",
            type: "failure",
            title: result.reason,
            message: `Check your device connection or port and try again.${
              device?.bootRequired
                ? ` Some ${device.name} required to press BOOT button when uploading the project.`
                : ""
            }`,
          })
        );
      }
      dispatch(setUpload(result.status === "success"));
      dispatch(removeToast("buildUpload"));
    }
  };

  return (
    <Tooltip
      placement="bottom"
      style="light"
      content={
        uploadTimestamp
          ? `Latest upload on: ${uploadTimestamp.toLocaleTimeString()}`
          : "Not uploaded"
      }
    >
      <Button
        size="sm"
        color={isUploading ? undefined : isUpload ? "success" : "failure"}
        disabled={disabled || !port || isVerifying || isUploading}
        onClick={onClick}
      >
        {isUploading ? (
          <Spinner size="sm" className="mr-2" />
        ) : (
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
        )}
        Upload
      </Button>
    </Tooltip>
  );
}
