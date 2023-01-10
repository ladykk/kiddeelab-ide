import deviceLists from "../../devices";
import { Button, Modal } from "flowbite-react";
import { useState, Fragment, ReactNode } from "react";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import DeviceCard from "./DeviceCard";

export default function () {
  const { deviceId } = useAppSelector(selectProject);
  const [isShow, setShow] = useState<boolean>(false);

  const handleModal = () => setShow((i) => !i);

  return (
    <Fragment>
      <Button size="sm" onClick={handleModal}>
        {deviceId ? "Change" : "Select"}
      </Button>
      <Modal show={isShow} size="3xl" onClose={handleModal}>
        <Modal.Header>
          <p className="text-blue-600 font-bold">Select Device</p>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-3 gap-4">
            {(() => {
              const element: Array<ReactNode> = [];
              for (let deviceId in deviceLists)
                element.push(
                  <DeviceCard
                    key={deviceId}
                    device={deviceLists[deviceId]}
                    handleModal={handleModal}
                  />
                );
              return element;
            })()}
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}
