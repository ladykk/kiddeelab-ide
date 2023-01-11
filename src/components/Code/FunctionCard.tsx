import { Modal, Button } from "flowbite-react";
import { useState, Fragment } from "react";
import {
  STRING_COLOR,
  BOOLEAN_COLOR,
  VOID_COLOR,
  NUMBER_COLOR,
} from "../../blocks";
import { removeFunction } from "../../redux/project";
import { useAppDispatch } from "../../redux/store";
import { Function } from "../../types/code";

export default function FunctionCard({ info }: { info: Function }) {
  const [isShow, setShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleModal = () => setShow((i) => !i);
  const handleRemoveVariable = () => {
    dispatch(removeFunction(info.name));
    handleModal();
  };
  return (
    <Fragment>
      <div
        className="px-3 py-2 flex-col flex gap-2 rounded-md shadow-md hover:opacity-90 hover:cursor-pointer"
        style={{
          background:
            info.return === "String"
              ? STRING_COLOR
              : info.return === "Logic"
              ? BOOLEAN_COLOR
              : info.return === "Void"
              ? VOID_COLOR
              : NUMBER_COLOR,
        }}
        onClick={handleModal}
      >
        <div className="flex justify-between items-center">
          <p className="text-white text-lg font-bold">{info.name}</p>
          <p className="text-white text-sm font-medium">{info.return}</p>
        </div>
        <div className="bg-white grid grid-cols-2 gap-1 gap-x-5 p-2 rounded-md">
          {info.args.length > 0 ? (
            info.args.map((arg) => (
              <div
                className="text-sm text-white font-bold flex items-center justify-between border-2 p-2 rounded-md"
                style={{
                  background:
                    arg.type === "String"
                      ? STRING_COLOR
                      : arg.type === "Logic"
                      ? BOOLEAN_COLOR
                      : NUMBER_COLOR,
                  borderColor:
                    arg.type === "String"
                      ? STRING_COLOR
                      : arg.type === "Logic"
                      ? BOOLEAN_COLOR
                      : NUMBER_COLOR,
                }}
              >
                <p>{arg.name}</p>
                <p>
                  {arg.type}
                  {arg.size ? `[${arg.size}]` : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-center col-span-2 text-gray-500">
              No input
            </p>
          )}
        </div>
      </div>
      <Modal show={isShow} onClose={handleModal} size="sm">
        <Modal.Header>
          <p className="text-blue-600 font-bold">Remove Function</p>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            Are you sure to remove function "{info.name}"?
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
