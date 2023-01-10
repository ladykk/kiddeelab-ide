import { CheckIcon } from "@heroicons/react/24/solid";
import { Button, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import ArduinoGenerator, { codeFormator } from "../../blocks/arduino";
import { selectProject } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { removeToast, addToast } from "../../redux/toast";

export default function VerifyButton({ disabled }: { disabled: boolean }) {
  const { workspace, variables, functions, deviceId } =
    useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [isVerifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    if (workspace) {
      if (isVerifying) {
        workspace.options.readOnly = true;
      } else {
        workspace.options.readOnly = false;
      }
    }
  }, [isVerifying]);

  const onClick = async () => {
    if (workspace && deviceId) {
      setVerifying(true);
      dispatch(removeToast("buildVerifyResult"));
      dispatch(
        addToast({
          id: "buildVerify",
          type: "loading",
          title: "Verifying project",
        })
      );
      const raw = ArduinoGenerator.workspaceToCode(workspace);
      const code = codeFormator(raw, variables, functions);

      const result = await window.build.verify(deviceId, code);
      if (result.status === "success") {
        dispatch(
          addToast({
            id: "buildVerifyResult",
            type: "success",
            title: result.reason,
            message: result.output,
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
            message: result.error.message,
          })
        );
      }
      dispatch(removeToast("buildVerify"));

      setVerifying(false);
    }
  };

  return (
    <Button size="sm" disabled={disabled || isVerifying} onClick={onClick}>
      {isVerifying ? (
        <Spinner size="sm" className="mr-2" />
      ) : (
        <CheckIcon className="w-5 h-5 mr-2" />
      )}
      Verify
    </Button>
  );
}
