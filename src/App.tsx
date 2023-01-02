import MenuBar from "./components/MenuBar";
import Workspace from "./components/Workspace";
import "./blocks";
import Code, { CodeManage } from "./components/Code";
import Device, { DeviceManage } from "./components/Device";
import { NotificationPane } from "./components/Notification";
import { useInitializeCore } from "./hooks/core";
import { Fragment } from "react";
import Scratch from "./components/Scratch";

function App() {
  useInitializeCore();

  return (
    <Fragment>
      <div className="w-screen h-screen bg-gray-50 flex">
        <div className="w-full h-full flex flex-col">
          <MenuBar />
          <div className="w-full h-full flex">
            <div className="max-w-[450px] w-full border-r">
              <Device />
              <DeviceManage />
              <CodeManage />
            </div>
            <Workspace />
          </div>
        </div>
        <Code />
        <NotificationPane />
      </div>
      <Scratch />
    </Fragment>
  );
}

export default App;
