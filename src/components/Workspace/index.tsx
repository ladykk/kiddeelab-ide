import { Spinner } from "flowbite-react";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { initWorkspace, selectProject } from "../../redux/project";
import { svgResize } from "blockly";
import "../../styles/blockly.css";
import NotificationPane from "../Notification/NotificationPane";
import { setUpload, setVerify } from "../../redux/core";

export default function Workspace() {
  // [Hooks]
  const dispatch = useAppDispatch();

  // [States]
  const { workspace, showCode } = useAppSelector(selectProject);

  // [References]
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const blocklyArea = useRef<HTMLDivElement>(null);

  // [Effects]
  // E - Initialize new workspace when component loaded with no workspace.
  useEffect(() => {
    if (!workspace) dispatch(initWorkspace());
  }, []);

  // E - Delete previous workspace.
  useEffect(() => {
    if (workspace) {
      if (!blocklyDiv.current) return;

      if (
        blocklyDiv.current.childElementCount > 1 &&
        blocklyDiv.current.firstChild
      )
        blocklyDiv.current.removeChild(blocklyDiv.current.firstChild);
    }
  }, [workspace]);

  // E - Update workspace size.
  useEffect(() => {
    if (workspace) svgResize(workspace);
  });
  useEffect(() => {
    if (workspace) {
      const onResize = function () {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        if (!blocklyArea.current || !blocklyDiv.current) return;
        let element: HTMLElement | null = blocklyArea.current as HTMLElement;
        let x = 0;
        let y = 0;
        do {
          x += element.offsetLeft;
          y += element.offsetTop;
          element = element.offsetParent as HTMLElement | null;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.current.style.left = x - 350 + "px";
        blocklyDiv.current.style.top = y - 56 + "px";
        blocklyDiv.current.style.right = 400 + "px";
        blocklyDiv.current.style.width = blocklyArea.current.offsetWidth + "px";
        blocklyDiv.current.style.height =
          blocklyArea.current.offsetHeight + "px";
        svgResize(workspace);
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }
  }, [workspace]);

  // E - Update core when workspace change.
  useEffect(() => {
    const onChange = () => {
      dispatch(setVerify(false));
      dispatch(setUpload(false));
    };
    if (workspace) workspace.addChangeListener(onChange);
  }, [workspace]);

  return (
    <div
      id="blocklyArea"
      ref={blocklyArea}
      className="bg-gray-100 w-full h-full relative"
    >
      <NotificationPane />
      {/* Initailizing App */}
      {!workspace && (
        <div className="absolute z-10 top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center gap-6">
          <Spinner size="xl" />
          <p className="font-light text-lg">Initializing Workspace</p>
        </div>
      )}
      {/* Workspace Div */}
      <div
        id="blocklyDiv"
        ref={blocklyDiv}
        className="absolute z-0 w-full h-full"
      ></div>
    </div>
  );
}
