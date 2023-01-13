import deviceLists from "../../devices";
import { Button, Modal } from "flowbite-react";
import { Fragment, useState } from "react";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";

export default function PinoutModal() {
  const { deviceId } = useAppSelector(selectProject);
  const device = deviceId ? deviceLists[deviceId] : null;
  const [show, setShow] = useState<boolean>(false);
  return (
    <Fragment>
      <Button
        size="sm"
        disabled={!device || !device.pinout}
        onClick={() => setShow(true)}
      >
        Pinout
      </Button>
      <Modal show={show} onClose={() => setShow(false)} size="7xl">
        <Modal.Header>
          <p className="font-bold text-blue-600">{device?.name}'s Pinout</p>
        </Modal.Header>
        <Modal.Body>
          <img
            className="w-[80vw] h-[80vh] object-contain"
            src={device?.pinout}
            alt=""
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}
