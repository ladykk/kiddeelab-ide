import { Button, Dropdown } from "flowbite-react";
import { LOGO } from "../../assets";
import NewProject from "./NewProject";
import OpenProject from "./OpenProject";
import ProjectName from "./ProjectName";
import SaveAsProject from "./SaveAsProject";
import SaveProject from "./SaveProject";
import Undo from "./Undo";
import Redo from "./Redo";
import DeviceManage from "../Device/DeviceManage";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

function MenuBar() {
  const [isFileOpen, setFileOpen] = useState<boolean>(false);
  return (
    <div
      className={`w-full h-[56px] bg-blue-500 py-2 px-3 flex gap-2 items-center justify-between`}
    >
      <div className="flex items-center h-full gap-2 flex-1">
        <a href="https://www.kiddeelab.co.th/" target="_blank">
          <img
            src={LOGO}
            alt="KiddeeLab"
            className="bg-white p-[2px] w-[43px] h-[40px] aspect-square rounded"
          />
        </a>
        <div className="relative">
          <Button size="sm" onClick={() => setFileOpen(!isFileOpen)}>
            File
            {isFileOpen ? (
              <ChevronUpIcon className="w-4 ml-2" />
            ) : (
              <ChevronDownIcon className="w-4 ml-2" />
            )}
          </Button>
          {isFileOpen && (
            <div
              className="bg-white p-2 top-0 translate-y-[44px] absolute z-10 shadow min-w-[160px] rounded-md"
              onClick={() => setFileOpen(false)}
            >
              <NewProject />
              <Dropdown.Divider />
              <OpenProject />
              <SaveProject />
              <SaveAsProject />
            </div>
          )}
        </div>

        <Undo />
        <Redo />
      </div>
      <ProjectName />
      <DeviceManage />
    </div>
  );
}

export default MenuBar;
