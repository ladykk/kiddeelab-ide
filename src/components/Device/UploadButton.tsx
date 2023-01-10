import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Button, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import ArduinoGenerator, { codeFormator } from "../../blocks/arduino";
import { selectProject } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { removeToast, addToast } from "../../redux/toast";

export default function UploadButton({ disabled }: { disabled: boolean }) {
  const { workspace, variables, functions, deviceId, port } =
    useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [isUploading, setUploading] = useState<boolean>(false);

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
      setUploading(true);
      dispatch(removeToast("buildUploadResult"));
      dispatch(
        addToast({
          id: "buildUpload",
          type: "loading",
          title: "Uploading project",
        })
      );
      const raw = ArduinoGenerator.workspaceToCode(workspace);
      const code = codeFormator(raw, variables, functions);

      const result = await window.build.upload(port, deviceId, code);
      if (result.status === "success") {
        dispatch(
          addToast({
            id: "buildUploadResult",
            type: "success",
            title: result.reason,
            message: result.output,
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
            message: result.error.message,
          })
        );
      }
      dispatch(removeToast("buildUpload"));

      setUploading(false);
    }
  };

  return (
    <Button
      size="sm"
      disabled={disabled || !port || isUploading}
      onClick={onClick}
    >
      {isUploading ? (
        <Spinner size="sm" className="mr-2" />
      ) : (
        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
      )}
      Upload
    </Button>
  );
}
