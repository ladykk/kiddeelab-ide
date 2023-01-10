import { DeviceIds } from "../../types/device";
import deviceLists from "../../devices";
import { CpuChipIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

export default function DevicePreview({
  deviceId,
}: {
  deviceId: DeviceIds | null;
}) {
  return deviceId ? (
    <Fragment>
      <img src={deviceLists[deviceId].pic} className="p-1 h-[200px]" />
    </Fragment>
  ) : (
    <Fragment>
      <CpuChipIcon className="text-gray-400 w-28 h-28" />
      <p className="text-gray-500 font-medium">No Device Selected</p>
    </Fragment>
  );
}
