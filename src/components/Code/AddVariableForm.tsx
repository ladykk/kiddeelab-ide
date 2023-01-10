import { Label, TextInput, Select, Checkbox, Button } from "flowbite-react";
import { useState, ChangeEvent, FormEvent } from "react";
import { selectProject, addVariable } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { Variable } from "../../types/code";

export const initialVariableForm: Variable & { isArray: boolean } = {
  name: "",
  type: "Number",
  size: 0,
  isArray: false,
};

export default function AddVariableForm({
  handleModal,
}: {
  handleModal: () => void;
}) {
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
          // @ts-ignore
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
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
      return setError(
        `Cannot declare duplicate variable/function. (${form.name})`
      );
    }
    dispatch(
      addVariable({
        name: form.name,
        type: form.type,
        size: form.isArray ? form.size : undefined,
      })
    );
    setForm(initialVariableForm);
    handleModal();
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleAddVariable}>
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
        <Select id="type" value={form.type} onChange={handleOnChange} required>
          <option value="Number">Number</option>
          <option value="Boolean">Boolean</option>
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

      <Button type="submit">Add</Button>
    </form>
  );
}
