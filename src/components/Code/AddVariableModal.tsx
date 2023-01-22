import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import {
  Label,
  TextInput,
  Select,
  Checkbox,
  Button,
  Modal,
} from "flowbite-react";
import { useState, ChangeEvent, FormEvent, Fragment } from "react";
import { selectProject, addVariable } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { Variable } from "../../types/code";
import { convertName, convertVariableName } from "../../utils/code";

export const initialVariableForm: Variable & { isArray: boolean } = {
  name: "",
  type: "Number",
  size: 0,
  isArray: false,
};

export default function AddVariableModal() {
  const [show, setShow] = useState<boolean>(false);
  const { variables, functions } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Variable & { isArray: boolean }>(
    initialVariableForm
  );
  const [error, setError] = useState<string>("");
  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.id) {
      setForm((form) => ({
        ...form,
        [e.target.id]:
          e.target.type === "checkbox"
            ? // @ts-ignore
              e.target.checked
            : e.target.id === "name"
            ? convertVariableName(e.target.value)
            : e.target.value,
      }));
      setError("");
    }
  };

  const handleAddVariable = (e: FormEvent) => {
    e.preventDefault();

    // Reject if found duplicate name.
    if (
      variables.some((v) => v.name === form.name) ||
      functions.some((f) => f.name === form.name)
    ) {
      return setError(`Cannot declare duplicate variable. (${form.name})`);
    }
    dispatch(
      addVariable({
        name: form.name,
        type: form.type,
        size: form.isArray ? form.size : undefined,
      })
    );
    setForm(initialVariableForm);
    setShow(false);
  };
  return (
    <Fragment>
      <div
        className="bg-blue-700 px-4 py-2.5 flex text-white gap-2 items-center rounded-xl hover:bg-blue-600 hover:cursor-pointer"
        onClick={() => setShow(true)}
      >
        <PlusIcon className="w-5 h-5" />
        <p className="font-semibold text-sm">Add Variable</p>
      </div>

      <Modal size="lg" show={show} onClose={() => setShow(false)}>
        <form onSubmit={handleAddVariable}>
          <Modal.Header>
            <p className="text-blue-600 font-bold">Add Variable</p>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Variable name" />
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
                <Label htmlFor="type" value="Data type" />
              </div>
              <Select
                id="type"
                value={form.type}
                onChange={handleOnChange}
                required
              >
                <option value="Number">Number</option>
                <option value="Logic">Logic</option>
                <option value="String">String</option>
              </Select>
            </div>
            {form.isArray && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="size" value="Array size" />
                </div>
                <TextInput
                  id="size"
                  type="number"
                  min={1}
                  value={form.size}
                  onChange={handleOnChange}
                  required
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="isArray"
                checked={form.isArray}
                onChange={handleOnChange}
              />
              <Label htmlFor="isArray">Create as an array.</Label>
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
