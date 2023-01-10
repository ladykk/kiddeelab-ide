import deviceLists from "../../devices";
import { CpuChipIcon } from "@heroicons/react/24/solid";
import { Selected } from "blockly/core/events/events_selected";
import src from "concurrently";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";

import PortSelector from "./PortSelector";
import DevicePreview from "./DevicePreview";
import SelectDevice from "./SelectDevice";

function Device() {
  const { deviceId } = useAppSelector(selectProject);
  return (
    <div className="min-h-[300px] bg-gray-100 flex flex-col border-b flex-0">
      <div className="bg-gray-50 px-4 py-2 border-t border-b flex items-center justify-between">
        <p className="text-lg font-bold text-blue-600 ">
          {deviceId ? deviceLists[deviceId].name : "Device"}
        </p>
        <div className="flex gap-2">
          <SelectDevice />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 gap-3 relative">
        <DevicePreview deviceId={deviceId} />
        <PortSelector />
      </div>
    </div>
  );
}

export default Device;
