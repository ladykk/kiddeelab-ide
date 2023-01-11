import { Modal, Button } from "flowbite-react";
import { useState, Fragment } from "react";
import { DEVICE_COLOR } from "../../blocks";
import { removePin } from "../../redux/project";
import { useAppDispatch } from "../../redux/store";
import { Pin } from "../../types/code";

export default function PinCard({ info }: { info: Pin }) {
  const [isShow, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleModal = () => setShow((i) => !i);
  const handleRemovePin = () => {
    dispatch(removePin(info.name));
    handleModal();
  };
  return (
    <Fragment>
      <div
        className="px-3 py-2 rounded-md shadow-md flex justify-between items-center hover:opacity-90 hover:cursor-pointer"
        style={{
          background: DEVICE_COLOR,
        }}
        onClick={handleModal}
      >
        <p className="text-white text-lg font-bold">{info.name}</p>
        <p className="text-white text-sm font-medium">Pin: {info.pin}</p>
      </div>
      <Modal show={isShow} onClose={handleModal} size="sm">
        <Modal.Header>
          <p className="text-blue-600 font-bold">Remove Variable</p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            Are you sure to remove pin name "{info.name}"?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleRemovePin} fullSized>
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
