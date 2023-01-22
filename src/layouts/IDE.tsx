import CodeManage from "../components/Code/CodeManage";
import LiveCode from "../components/Code/LiveCode";
import Device from "../components/Device";
import DeviceManage from "../components/Device/DeviceManage";
import SerialMonitor from "../components/Device/SerialMonitor";
import MenuBar from "../components/MenuBar";
import Workspace from "../components/Workspace";
import { useInitializeCore } from "../hooks/core";

export default function IDE() {
  useInitializeCore();
  return (
    <div className="w-screen h-screen max-h-[100vh] max-w-[100vw] bg-gray-50 flex">
      <div className="w-full h-full flex flex-col">
        <MenuBar />
        <div
          className="w-full h-full flex"
          style={{ maxHeight: "calc(100% - 56px)" }}
        >
          <div className="max-w-[450px] w-full border-r flex flex-col">
            <Device />
            <CodeManage />
          </div>
          <Workspace />
          <div className="max-w-[450px] w-full h-full bg-gray-100 flex flex-col border-l">
            <LiveCode />
            <SerialMonitor />
          </div>
        </div>
      </div>
    </div>
  );
}
