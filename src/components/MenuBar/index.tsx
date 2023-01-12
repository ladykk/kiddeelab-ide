import { Dropdown } from "flowbite-react";
import { LOGO } from "../../assets";
import SerialMonitor from "../Device/SerialMonitor";
import NewProject from "./NewProject";
import OpenProject from "./OpenProject";
import ProjectName from "./ProjectName";
import SaveAsProject from "./SaveAsProject";
import SaveProject from "./SaveProject";
import Undo from "./Undo";
import Redo from "./Redo";
import CodeToggle from "./Code";

function MenuBar() {
  return (
    <div
      className={`w-full h-[56px] bg-blue-500 py-2 px-3 flex gap-2 items-center justify-between`}
    >
      <div className="flex items-center h-full gap-2 flex-1">
        <img
          src={LOGO}
          alt="KiddeeLab"
          className="bg-white p-[2px] w-[43px] h-[40px] aspect-square rounded"
        />

        <Dropdown label={<div className="flex gap-2">Files</div>} size="sm">
          <NewProject />
          <Dropdown.Divider />
          <OpenProject />
          <SaveProject />
          <SaveAsProject />
        </Dropdown>
        <Undo />
        <Redo />
      </div>
      <ProjectName />
      <div className="flex h-full items-center gap-2 mr-2 flex-1 justify-end">
        <SerialMonitor />
        <CodeToggle />
      </div>
    </div>
  );
}

export default MenuBar;
