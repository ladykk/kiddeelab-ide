import {
  MinusCircleIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import {
  Label,
  TextInput,
  Select,
  Table,
  Checkbox,
  Button,
  Modal,
} from "flowbite-react";
import { useState, ChangeEvent, FormEvent, Fragment } from "react";
import shortid from "shortid";
import { STRING_COLOR, BOOLEAN_COLOR, NUMBER_COLOR } from "../../blocks";
import { selectProject, addFunction } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { Function, Variable } from "../../types/code";
import { convertName, convertVariableName } from "../../utils/code";
import { initialVariableForm } from "./AddVariableModal";

export const initialFunctionForm: Function = {
  name: "",
  return: "Void",
  args: [],
};

export default function AddFunctionModal() {
  const [show, setShow] = useState<boolean>(false);
  const { variables, functions } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Function>(initialFunctionForm);
  const [args, setArgs] = useState<
    Array<Variable & { id: string; isArray: boolean }>
  >([]);
  const [error, setError] = useState<string>("");

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.id) {
      setForm({
        ...form,
        [e.target.id]:
          e.target.type === "checkbox"
            ? // @ts-ignore
              e.target.checked
            : e.target.id === "name"
            ? convertVariableName(e.target.value)
            : e.target.value,
      });
      setError("");
    }
  };

  const handleOnAddFunction = (e: FormEvent) => {
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

    // Reject if found deuplicate arguments
    for (let arg of args) {
      if (args.some((a) => a.name === arg.name && a.id !== arg.id))
        return setError(`Cannot declare duplicate arguments. (${arg.name})`);
    }

    dispatch(
      addFunction({
        name: convertName(form.name),
        return: form.return,
        args: args.map((a) => ({
          name: convertName(form.name),
          size: a.isArray ? a.size : undefined,
          type: a.type,
        })),
      })
    );
    setShow(false);
  };

  const handleAddArg = () => {
    if (!args.some((arg) => arg.name === ""))
      setArgs((args) => [
        ...args,
        {
          ...initialVariableForm,
          id: shortid.generate(),
          isArray: false,
        },
      ]);
  };

  const handleArgChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: string
  ) => {
    if (e.target.id) {
      setArgs((args) =>
        args.map((arg) => {
          if (arg.id !== id) return arg;
          else {
            return {
              ...arg,
              [e.target.id]:
                e.target.type === "checkbox"
                  ? // @ts-ignore
                    e.target.checked
                  : e.target.id === "name"
                  ? convertVariableName(e.target.value)
                  : e.target.value,
            };
          }
        })
      );
      setError("");
    }
  };

  const handleRemoveArg = (id: string) => {
    setArgs((args) => args.filter((arg) => arg.id !== id));
  };

  return (
    <Fragment>
      <div
        className="bg-blue-700 px-4 py-2.5 flex text-white gap-2 items-center rounded-xl hover:bg-blue-600 hover:cursor-pointer"
        onClick={() => setShow(true)}
      >
        <PlusIcon className="w-5 h-5" />
        <p className="font-semibold text-sm">Add Function</p>
      </div>

      <Modal size="4xl" show={show} onClose={() => setShow(false)}>
        <form onSubmit={handleOnAddFunction}>
          <Modal.Header>
            <p className="text-blue-600 font-bold">Add Function</p>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Function name" />
              </div>
              <TextInput
                id="name"
                value={form.name}
                type="text"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <div className="mb-2 block">
                <Label htmlFor="return" value="Return type" />
              </div>
              <Select
                id="return"
                value={form.return}
                onChange={handleOnChange}
                required
              >
                <option value="Void">Void</option>
                <option value="Number">Number</option>
                <option value="Logic">Logic</option>
                <option value="String">String</option>
              </Select>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 block">
                <Label htmlFor="args" value="Arguments" />
              </div>

              <div className="flex flex-col gap-2">
                <Table>
                  <Table.Head className="bg-blue-500">
                    <Table.HeadCell className="text-center text-white">
                      Array
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-white">
                      Name
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-white">
                      Data type
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-white">
                      Size
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center text-white"></Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {args.map((arg, index) => (
                      <Table.Row
                        key={index}
                        style={{
                          background:
                            arg.type === "String"
                              ? STRING_COLOR
                              : arg.type === "Logic"
                              ? BOOLEAN_COLOR
                              : NUMBER_COLOR,
                        }}
                      >
                        <Table.Cell>
                          <div className="mx-auto flex items-center justify-center">
                            <Checkbox
                              id="isArray"
                              checked={arg.isArray}
                              onChange={(e) => handleArgChange(e, arg.id)}
                            />
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <TextInput
                            id="name"
                            type="text"
                            value={arg.name}
                            onChange={(e) => handleArgChange(e, arg.id)}
                            required
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Select
                            id="type"
                            value={arg.type}
                            onChange={(e) => handleArgChange(e, arg.id)}
                            required
                          >
                            <option value="Number">Number</option>
                            <option value="Logic">Logic</option>
                            <option value="String">String</option>
                          </Select>
                        </Table.Cell>
                        <Table.Cell>
                          <TextInput
                            id="size"
                            type="number"
                            min={1}
                            value={arg.size}
                            onChange={(e) => handleArgChange(e, arg.id)}
                            required
                            className="w-24 mx-auto"
                            disabled={!arg.isArray}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <MinusCircleIcon
                            className="w-8 h-8 p-0.5 text-white hover:opacity-80 hover:cursor-pointer mx-auto"
                            onClick={() => handleRemoveArg(arg.id)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <PlusCircleIcon
                  className="w-8 h-8 text-blue-600 hover:text-blue-800 hover:cursor-pointer mx-auto"
                  onClick={handleAddArg}
                />
              </div>
            </div>
            {error && <p className="text-red-600 font-medium">{error}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Add</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
}
