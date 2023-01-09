import {
  Badge,
  Button,
  Dropdown,
  Modal,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { LOGO } from "../assets";
import {
  ArrowDownOnSquareIcon,
  ArrowDownOnSquareStackIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  DocumentIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectProject, setProjectName } from "../redux/project";
import { handleLoadProject, handleSaveFile, newProject } from "../utils/file";
import { selectFile } from "../redux/file";
import { SerialMonitor } from "./Device";

function MenuBar() {
  const { workspace } = useAppSelector(selectProject);
  return (
    <div
      className={`w-full h-[56px] bg-blue-500 py-2 px-2 flex gap-2 items-center justify-between`}
    >
      <div className="flex items-center h-full gap-2 flex-1">
        <div className="mr-2 flex h-full items-center justify-center gap-2">
          <img
            src={LOGO}
            alt="KiddeeLab"
            className="bg-white p-[1px] w-auto h-full aspect-square rounded"
          />
          <p className="text-white font-bold hidden 2xl:block">
            KiddeeLab | IDE
          </p>
        </div>

        <Dropdown label={<div className="flex gap-2">Files</div>} size="sm">
          <NewProjectItem />
          <Dropdown.Divider />
          <OpenProjectItem />
          <SaveProjectItem />
          <SaveAsProjectItem />
        </Dropdown>
        <Button
          size="sm"
          onClick={() => {
            if (workspace) workspace.undo(false);
          }}
        >
          <ArrowUturnLeftIcon className="w-4 mr-2" />
          Undo
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (workspace) workspace.undo(true);
          }}
        >
          <ArrowUturnRightIcon className="w-4 mr-2" />
          Redo
        </Button>
      </div>
      <ProjectInfo />
      <div className="flex h-full items-center gap-2 mr-2 flex-1 justify-end">
        <SerialMonitor />
      </div>
    </div>
  );
}

function ProjectInfo() {
  const { projectName, isChange } = useAppSelector(selectProject);
  const file = useAppSelector(selectFile);
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center gap-2 flex-1 justify-center">
      {file && (
        <Tooltip content={file} placement="bottom" style="light">
          <DocumentIcon className="text-white w-6 h-6 p-0.5" />
        </Tooltip>
      )}
      <TextInput
        value={projectName}
        onChange={(e) => dispatch(setProjectName(e.target.value))}
        sizing="sm"
        placeholder="Untitle Project"
        className="w-[200px]"
      />
      {file && (
        <Badge color={isChange ? "warning" : "success"} size="sm">
          {isChange ? "Unsaved" : "Saved"}
        </Badge>
      )}
    </div>
  );
}

function NewProjectItem() {
  const [isShow, setShow] = useState<boolean>(false);
  const { isChange } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const onClick = () => {
    if (isChange) setShow(true);
    else newProject(dispatch);
  };
  return (
    <Fragment>
      <Dropdown.Item icon={FolderPlusIcon} onClick={onClick}>
        New Project
      </Dropdown.Item>
      <Modal show={isShow} size="sm" onClose={() => setShow(false)}>
        <Modal.Header>
          <p className="text-blue-600 font-bold">New Project</p>
        </Modal.Header>
        <Modal.Body>Are you sure to discard all changes?</Modal.Body>
        <Modal.Footer>
          <Button
            fullSized
            onClick={() => {
              newProject(dispatch);
              setShow(false);
            }}
          >
            Confirm
          </Button>
          <Button fullSized color="failure" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

function OpenProjectItem() {
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectProject);
  const file = useAppSelector(selectFile);
  const [show, setShow] = useState<boolean>(false);
  const [path, setPath] = useState<string>("");

  const onClick = async () => {
    const result = await window.file.openFile();
    if (result.status === "success") {
      if (project.isChange) {
        setShow(true);
        setPath(result.path);
      } else handleLoadProject(dispatch, result.path);
    }
  };

  return (
    <Fragment>
      <Dropdown.Item icon={FolderOpenIcon} onClick={onClick}>
        Open
      </Dropdown.Item>
      <Modal show={show} size="lg" onClose={() => setShow(false)}>
        <Modal.Header>
          <p className="text-blue-600 font-bold">Open Project</p>
        </Modal.Header>
        <Modal.Body>
          Current project has unsaved changes. Do you want to save first?
        </Modal.Body>
        <Modal.Footer>
          <Button
            fullSized
            onClick={async () => {
              await handleSaveFile(dispatch, project, file);
              handleLoadProject(dispatch, path);
              setShow(false);
            }}
          >
            Save
          </Button>
          <Button
            fullSized
            color="failure"
            onClick={async () => {
              handleLoadProject(dispatch, path);
              setShow(false);
            }}
          >
            Discard
          </Button>
          <Button fullSized color="light" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

function SaveProjectItem() {
  const project = useAppSelector(selectProject);
  const file = useAppSelector(selectFile);
  const dispatch = useAppDispatch();

  const onClick = async () => {
    if (project.deviceId) await handleSaveFile(dispatch, project, file);
  };
  return (
    <Fragment>
      <Dropdown.Item icon={ArrowDownOnSquareIcon} onClick={onClick}>
        Save
      </Dropdown.Item>
    </Fragment>
  );
}

function SaveAsProjectItem() {
  const project = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const onClick = async () => {
    if (project.deviceId) await handleSaveFile(dispatch, project);
  };

  return (
    <Fragment>
      <Dropdown.Item icon={ArrowDownOnSquareStackIcon} onClick={onClick}>
        Save As
      </Dropdown.Item>
    </Fragment>
  );
}

export default MenuBar;
