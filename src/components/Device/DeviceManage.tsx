import deviceLists from "../../devices";
import { ToggleSwitch } from "flowbite-react";
import { Fragment } from "react";
import { selectCore } from "../../redux/core";
import { selectProject, setShowCode } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import UploadButton from "./UploadButton";
import VerifyButton from "./VerifyButton";

export default function DeviceManage() {
  const { workspace, deviceId, showCode } = useAppSelector(selectProject);
  const { platformLists, isInstalled } = useAppSelector(selectCore);
  const dispatch = useAppDispatch();
  const handleCodeSwitch = () => {
    dispatch(setShowCode(!showCode));
  };

  const disableCore =
    !deviceId ||
    !isInstalled ||
    !platformLists.includes(deviceId ? deviceLists[deviceId].platform : "");

  return (
    <Fragment>
      <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between flex-0">
        <ToggleSwitch
          checked={showCode}
          label="Live Code"
          onChange={handleCodeSwitch}
          disabled={!deviceId}
        />
        <div className="flex gap-2">
          <VerifyButton disabled={disableCore} />
          <UploadButton disabled={disableCore} />
        </div>
      </div>
    </Fragment>
  );
}
