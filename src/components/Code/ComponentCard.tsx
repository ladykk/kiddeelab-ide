import componentLists from "../../devices/components";
import { Fragment, useState } from "react";
import { removeComponent } from "../../redux/project";
import { Component } from "../../types/component";
import { COMPONENT_COLOR, DEVICE_COLOR } from "../../blocks";
import { Modal, Button } from "flowbite-react";
import { useAppDispatch } from "../../redux/store";

export default function ComponentCard({ component }: { component: Component }) {
  const [isShow, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleModal = () => setShow((i) => !i);
  const handleRemoveComponent = () => {
    dispatch(removeComponent(component.name));
    handleModal();
  };

  const detail = componentLists.find((c) => c.id === component.component);

  return (
    <Fragment>
      <div
        className="px-3 py-2 flex-col flex gap-2 rounded-md shadow-md hover:opacity-90 hover:cursor-pointer"
        style={{
          background: COMPONENT_COLOR,
        }}
        onClick={handleModal}
      >
        <div className="flex justify-between items-center">
          <p className="text-white text-lg font-bold">{component.name}</p>
          <p className="text-white text-sm font-medium">
            {detail?.name || "Unknown"}
          </p>
        </div>
        <div className="bg-white grid grid-cols-4 gap-y-2 gap-x-5 p-2 rounded-md">
          {component.pins.map((pin) => (
            <p
              className="p-2 rounded text-center text-white font-bold shadow text-xs"
              style={{ background: DEVICE_COLOR }}
            >
              {pin.name} : {pin.pin}
            </p>
          ))}
        </div>
      </div>
      <Modal show={isShow} onClose={handleModal} size="sm">
        <Modal.Header>
          <p className="text-blue-600 font-bold">Remove Component</p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            Are you sure to remove component name "{component.name}"?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleRemoveComponent} fullSized>
            Remove
          </Button>
          <Button onClick={handleModal} fullSized>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
