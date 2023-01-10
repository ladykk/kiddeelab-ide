import { FolderPlusIcon } from "@heroicons/react/24/solid";
import { Dropdown, Modal, Button } from "flowbite-react";
import { useState, Fragment } from "react";
import { selectProject } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { newProject } from "../../utils/file";

export default function NewProject() {
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
