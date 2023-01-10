import { FolderOpenIcon } from "@heroicons/react/24/solid";
import { Dropdown, Modal, Button } from "flowbite-react";
import { useState, Fragment } from "react";
import { selectFile } from "../../redux/file";
import { selectProject } from "../../redux/project";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { handleLoadProject, handleSaveFile } from "../../utils/file";

export default function OpenProject() {
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
