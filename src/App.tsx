import MenuBar from "./components/MenuBar";
import Workspace from "./components/Workspace";
import "./blocks";
import LiveCode from "./components/Code/LiveCode";
import Device from "./components/Device";
import DeviceManage from "./components/Device/DeviceManage";
import { Fragment } from "react";
import Scratch from "./layouts/Scratch";
import IDE from "./layouts/IDE";

function App() {
  return (
    <Fragment>
      <IDE />
      <Scratch />
    </Fragment>
  );
}

export default App;
