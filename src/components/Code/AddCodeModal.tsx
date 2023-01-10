import { PlusIcon } from "@heroicons/react/24/solid";
import { Button, Modal, Tabs } from "flowbite-react";
import { useState, Fragment } from "react";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import AddFunctionForm from "./AddFunctionForm";
import AddVariableForm from "./AddVariableForm";

export default function AddCodeModal() {
  const { deviceId } = useAppSelector(selectProject);
  const [isShow, setShow] = useState<boolean>(false);
  const handleModal = () => setShow((i) => !i);
  return (
    <Fragment>
      <Button size="sm" onClick={handleModal} disabled={!deviceId}>
        <PlusIcon className="w-5 h-5 mr-2" />
        Add
      </Button>
      <Modal show={isShow} size="4xl" onClose={handleModal}>
        <Modal.Header>
          <p className="text-blue-600 font-bold">Add Variable / Function</p>
        </Modal.Header>
        <Modal.Body>
          <Tabs.Group style="pills">
            <Tabs.Item title="Variable" active={true}>
              <AddVariableForm handleModal={handleModal} />
            </Tabs.Item>
            <Tabs.Item title="Function">
              <AddFunctionForm handleModal={handleModal} />
            </Tabs.Item>
          </Tabs.Group>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}
