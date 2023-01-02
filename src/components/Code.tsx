import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
import ArduinoGenerator, { codeFormator } from "../blocks/arduino";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  addFunction,
  addVariable,
  removeFunction,
  removeVariable,
  selectProject,
  setChange,
} from "../redux/project";
import SyntaxHighlighrer from "react-syntax-highlighter";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  Table,
  Tabs,
  TextInput,
} from "flowbite-react";
import {
  PlusCircleIcon,
  PlusIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import { Variable, Function } from "../types/code";
import {
  BOOLEAN_COLOR,
  NUMBER_COLOR,
  STRING_COLOR,
  VOID_COLOR,
} from "../blocks";
import shortid from "shortid";

function Code() {
  const [currentCode, setCode] = useState<string>("");
  const { workspace, variables, functions, showCode } =
    useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const onWorkspaceChange = () => {
    if (workspace) {
      const raw = ArduinoGenerator.workspaceToCode(workspace);
      setCode(codeFormator(raw, variables, functions));
      dispatch(setChange(true));
    }
  };

  useEffect(() => {
    if (workspace) {
      workspace.addChangeListener(onWorkspaceChange);
      return () => {
        workspace.removeChangeListener(onWorkspaceChange);
      };
    }
  });

  useEffect(onWorkspaceChange, [variables, functions, showCode]);

  return showCode ? (
    <div className="max-w-[450px] w-full h-full bg-gray-100 flex flex-col z-40 border-l">
      <p className="bg-gray-50 text-lg font-bold px-4 py-2 text-blue-600 border-t border-b">
        Live Code
      </p>
      <SyntaxHighlighrer
        langauge="arduino"
        customStyle={{ width: "100%", backgroundColor: "rgb(243 244 246)" }}
      >
        {currentCode}
      </SyntaxHighlighrer>
    </div>
  ) : (
    <Fragment></Fragment>
  );
}

export function CodeManage() {
  const { variables, functions } = useAppSelector(selectProject);
  return (
    <div>
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
        <p className="text-lg font-bold text-blue-600 ">
          Variables & Functions
        </p>
        <AddCodeModal />
      </div>
      <div className="px-3 py-4 overflow-y-auto">
        {variables.length === 0 && functions.length === 0 ? (
          <Fragment>
            <p className="text-center text-gray-500">
              No variable and function.
            </p>
          </Fragment>
        ) : (
          <div className="flex flex-col gap-3">
            {variables.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="font-bold text-gray-500">Variables</p>
                <div className="flex flex-col gap-1">
                  {variables.map((v) => (
                    <VariableCard key={v.name} info={v} />
                  ))}
                </div>
              </div>
            )}
            {functions.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="font-bold text-gray-500">Functions</p>
                <div className="flex flex-col gap-1">
                  {functions.map((f) => (
                    <FunctionCard key={f.name} info={f} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VariableCard({ info }: { info: Variable }) {
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
              : info.type === "Boolean"
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

function FunctionCard({ info }: { info: Function }) {
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
              : info.return === "Boolean"
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
          {info.args.map((arg) => (
            <div
              className="text-sm text-white font-bold flex items-center justify-between border-2 p-2 rounded-md"
              style={{
                background:
                  arg.type === "String"
                    ? STRING_COLOR
                    : arg.type === "Boolean"
                    ? BOOLEAN_COLOR
                    : NUMBER_COLOR,
                borderColor:
                  arg.type === "String"
                    ? STRING_COLOR
                    : arg.type === "Boolean"
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
          ))}
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

function AddCodeModal() {
  const { deviceId } = useAppSelector(selectProject);
  const [isShow, setShow] = useState<boolean>(false);
  const handleModal = () => setShow((i) => !i);
  return (
    <Fragment>
      <Button size="sm" onClick={handleModal} disabled={!deviceId}>
        <PlusIcon className="w-5 h-5 mr-2" />
        Add
      </Button>
      <Modal show={isShow} size="4xl" onClose={handleModal}>
        <Modal.Header>
          <p className="text-blue-600 font-bold">Add Variable / Function</p>
        </Modal.Header>
        <Modal.Body>
          <Tabs.Group style="pills">
            <Tabs.Item title="Variable" active={true}>
              <AddVariableForm handleModal={handleModal} />
            </Tabs.Item>
            <Tabs.Item title="Function">
              <AddFunctionForm handleModal={handleModal} />
            </Tabs.Item>
          </Tabs.Group>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

const initialVariableForm: Variable & { isArray: boolean } = {
  name: "",
  type: "Number",
  size: 0,
  isArray: false,
};

function AddVariableForm({ handleModal }: { handleModal: () => void }) {
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

const initialFunctionForm: Function = {
  name: "",
  return: "Void",
  args: [],
};

function AddFunctionForm({ handleModal }: { handleModal: () => void }) {
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
      setForm({ ...form, [e.target.id]: e.target.value });
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
        ...form,
        args: args.filter((a) => ({
          name: a.name,
          size: a.size,
          type: a.type,
        })),
      })
    );
    handleModal();
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
              [e.target.id]: e.target.value,
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
    <form className="flex flex-col gap-4" onSubmit={handleOnAddFunction}>
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
          <option value="Boolean">Boolean</option>
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
                        : arg.type === "Boolean"
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
                      <option value="Boolean">Boolean</option>
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
      <Button type="submit">Add</Button>
    </form>
  );
}

export default Code;
