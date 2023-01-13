import deviceLists from "../../devices";
import { Fragment } from "react";
import { selectCore } from "../../redux/core";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import UploadButton from "./UploadButton";
import VerifyButton from "./VerifyButton";
import PortSelector from "./PortSelector";
import PinoutModal from "./PinoutModal";

export default function DeviceManage() {
  const { deviceId } = useAppSelector(selectProject);
  const { platformLists, isInstalled } = useAppSelector(selectCore);

  const disableCore =
    !deviceId ||
    !isInstalled ||
    !platformLists.includes(deviceId ? deviceLists[deviceId].platform : "");

  return (
    <Fragment>
      <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between flex-0">
        <div className="flex gap-2">
          <PortSelector />
          <PinoutModal />
        </div>
        <div className="flex gap-2">
          <VerifyButton disabled={disableCore} />
          <UploadButton disabled={disableCore} />
        </div>
      </div>
    </Fragment>
  );
}
