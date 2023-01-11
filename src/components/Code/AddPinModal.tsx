import deviceLists from "../../devices";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { addPin, selectProject } from "../../redux/project";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Pin } from "../../types/code";
import { convertDefine } from "../../utils/code";

export const initialPinForm: Pin = {
  name: "",
  pin: "",
};

export default function AddPinModal() {
  const [show, setShow] = useState<boolean>(false);
  const { pins, deviceId } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Pin>(initialPinForm);
  const [error, setError] = useState<string>("");

  const device = deviceId ? deviceLists[deviceId] : null;

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.id) {
      setForm((form) => ({
        ...form,
        [e.target.id]:
          // @ts-ignore
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
      setError("");
    }
  };

  const handleAddPin = (e: FormEvent) => {
    e.preventDefault();

    // Reject if found duplicate pin.
    if (pins.some((p) => p.name === form.name)) {
      return setError(`Cannot named duplicate pin. (${form.name})`);
    }
    dispatch(addPin({ name: convertDefine(form.name), pin: form.pin }));
    setForm(initialPinForm);
    setShow(false);
  };
  return (
    <Fragment>
      <PlusCircleIcon
        className="w-8 h-8 text-blue-700 hover:text-blue-800 hover:cursor-pointer mx-auto"
        onClick={() => setShow(true)}
      />
      <Modal size="lg" show={show} onClose={() => setShow(false)}>
        <form onSubmit={handleAddPin}>
          <Modal.Header>
            <p className="text-blue-600 font-bold">Add Pin</p>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Pin name" />
              </div>
              <TextInput
                id="name"
                type="text"
                value={form.name}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <div className="mb-2 block">
                <Label htmlFor="pin" value="Pin" />
              </div>
              <Select
                id="pin"
                value={form.pin}
                onChange={handleOnChange}
                required
              >
                <option value="" hidden>
                  Select Pin
                </option>
                {device &&
                  device.pins
                    .filter((p) => pins.every((pin) => pin.pin !== p))
                    .map((p) => <option value={p}>{p}</option>)}
              </Select>
            </div>

            {error && <p className="text-red-600 font-medium">{error}</p>}
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit" fullSized>
              Add
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
}
