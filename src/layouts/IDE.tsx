import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import CodeManage from "../components/Code/CodeManage";
import LiveCode from "../components/Code/LiveCode";
import Device from "../components/Device";
import SerialMonitor from "../components/Device/SerialMonitor";
import MenuBar from "../components/MenuBar";
import Workspace from "../components/Workspace";
import { useInitializeCore } from "../hooks/core";

export default function IDE() {
  useInitializeCore();
  const [showSidebar, setSidebar] = useState<boolean>(false);
  return (
    <div className="w-screen h-screen max-h-[100vh] max-w-[100vw] bg-gray-50 flex overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <MenuBar />
        <div
          className="w-full h-full flex"
          style={{ maxHeight: "calc(100% - 56px)" }}
        >
          <div className="min-w-[350px] max-w-[350px] w-full border-r flex flex-col">
            <Device />
            <CodeManage />
          </div>
          <Workspace />
          <div
            className={`z-20 fixed right-0 top-[300px] hover:cursor-pointer hover:opacity-80 px-1 h-20 rounded-l-2xl flex items-center justify-center border-2 shadow-lg border-r-0 ${
              !showSidebar
                ? "bg-white border-blue-500 hover:bg-blue-100"
                : "bg-blue-500 border-blue-500"
            }`}
            onClick={() => setSidebar((s) => !s)}
          >
            <ChatBubbleBottomCenterTextIcon
              className={`w-5 h-5 ${
                !showSidebar ? "text-blue-500" : "text-white"
              }`}
            />
          </div>
          {showSidebar && (
            <div className="min-w-[400px] max-w-[400px] w-full h-full bg-gray-100 border-l flex flex-col z-10">
              <LiveCode />
              <SerialMonitor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
