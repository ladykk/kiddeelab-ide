import CodeManage from "../components/Code/CodeManage";
import LiveCode from "../components/Code";
import Device from "../components/Device";
import DeviceManage from "../components/Device/DeviceManage";
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
            <DeviceManage />
            <CodeManage />
          </div>
          <Workspace />
          <LiveCode />
        </div>
      </div>
    </div>
  );
}
