import { Modal, Button } from "flowbite-react";
import { useState, Fragment } from "react";
import { STRING_COLOR, BOOLEAN_COLOR, NUMBER_COLOR } from "../../blocks";
import { removeVariable } from "../../redux/project";
import { useAppDispatch } from "../../redux/store";
import { Variable } from "../../types/code";

export default function VariableCard({ info }: { info: Variable }) {
  const [isShow, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleModal = () => setShow((i) => !i);
  const handleRemoveVariable = () => {
    dispatch(removeVariable(info.name));
    handleModal();
  };
  return (
    <Fragment>
      <div
        className="px-3 py-2 rounded-md shadow-md flex justify-between items-center hover:opacity-90 hover:cursor-pointer"
        style={{
          background:
            info.type === "String"
              ? STRING_COLOR
              : info.type === "Logic"
              ? BOOLEAN_COLOR
              : NUMBER_COLOR,
        }}
        onClick={handleModal}
      >
        <p className="text-white text-lg font-bold">{info.name}</p>
        <p className="text-white text-sm font-medium">
          {info.type}
          {info.size ? `[${info.size}]` : ""}
        </p>
      </div>
      <Modal show={isShow} onClose={handleModal} size="sm">
        <Modal.Header>
          <p className="text-blue-600 font-bold">Remove Variable</p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            Are you sure to remove variable "{info.name}"?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleRemoveVariable} fullSized>
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
