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
    <div className="flex h-full items-center gap-2 mr-2 flex-1 justify-end">
      <PortSelector />
      <PinoutModal />
      <VerifyButton disabled={disableCore} />
      <UploadButton disabled={disableCore} />
    </div>
  );
}
