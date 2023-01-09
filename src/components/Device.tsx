import {
  ArrowDownTrayIcon,
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  CpuChipIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  selectProject,
  setDeviceId,
  setPort,
  setShowCode,
} from "../redux/project";
import deviceLists from "../devices/";
import { Device as DeviceType, DeviceInfo, SerialData } from "../types/device";
import { selectCore, setPlatformLists } from "../redux/core";
import { addToast, removeToast } from "../redux/toast";
import ArduinoGenerator, { codeFormator } from "../blocks/arduino";
import { useChatScroll } from "../hooks/chat";

function Device() {
  const { deviceId } = useAppSelector(selectProject);
  return (
    <div className="min-h-[300px] bg-gray-100 flex flex-col border-b flex-0">
      <div className="bg-gray-50 px-4 py-2 border-t border-b flex items-center justify-between">
        <p className="text-lg font-bold text-blue-600 ">
          {deviceId ? deviceLists[deviceId].name : "Device"}
        </p>
        <div className="flex gap-2">
          <PortSelector />
          <SelectDevice />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        {deviceId ? (
          <Fragment>
            <img src={deviceLists[deviceId].pic} className="p-1 h-[200px]" />
          </Fragment>
        ) : (
          <Fragment>
            <CpuChipIcon className="text-gray-400 w-32 h-32" />
            <p className="text-gray-500 text-lg font-medium">
              No Device Selected
            </p>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default Device;

export function SelectDevice() {
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

export function DeviceCard({
  device,
  handleModal,
}: {
  device: DeviceType;
  handleModal: () => void;
}) {
  const { deviceId } = useAppSelector(selectProject);
  const { platformLists } = useAppSelector(selectCore);
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(setDeviceId(device.id));
    handleModal();
    if (!platformLists.includes(device.platform)) {
      (async () => {
        dispatch(
          addToast({
            id: `installCore:${device.id}`,
            type: "loading",
            title: `Loading dependencies for ${device.name}`,
          })
        );
        await window.core
          .installCore(device.platform)
          .then((result) => {
            if (result) {
              dispatch(
                addToast({
                  id: `installCoreStatus:${device.id}`,
                  type: "success",
                  title: `Dependencies installed`,
                })
              );
            } else {
              dispatch(
                addToast({
                  id: `installCoreStatus:${device.id}`,
                  type: "failure",
                  title: `Dependencies cannot be installed`,
                })
              );
            }
          })
          .catch((err) => {
            dispatch(
              addToast({
                id: `installCoreStatus:${device.id}`,
                type: "failure",
                title: `Dependencies cannot be installed`,
              })
            );
          })
          .finally(async () => {
            dispatch(removeToast(`installCore:${device.id}`));
            setTimeout(
              () => dispatch(removeToast(`installCoreStatus:${device.id}`)),
              5000
            );
            const platforms = await window.core.installList();
            dispatch(setPlatformLists(platforms));
          });
      })();
    }
  };
  return (
    <div className="border p-5 rounded-md shadow h-72 flex flex-col justify-between gap-3">
      <img src={device.pic} alt={device.name} className="my-auto" />
      <div className="flex flex-col gap-3">
        <p className="font-medium text-lg text-center">{device.name}</p>
        <Button onClick={onClick} disabled={deviceId === device.id}>
          {deviceId === device.id ? "Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
}

export function DeviceManage() {
  const { workspace, deviceId, showCode } = useAppSelector(selectProject);
  const { platformLists, isInstalled } = useAppSelector(selectCore);
  const dispatch = useAppDispatch();
  const handleCodeSwitch = () => {
    dispatch(setShowCode(!showCode));
  };

  const disableCore =
    !deviceId ||
    !isInstalled ||
    !platformLists.includes(deviceId ? deviceLists[deviceId].platform : "");

  return (
    <Fragment>
      <div className="px-2 py-2 border-b bg-gray-50 flex items-center justify-between flex-0">
        <ToggleSwitch
          checked={showCode}
          label="Live Code"
          onChange={handleCodeSwitch}
          disabled={!deviceId}
        />
        <div className="flex gap-2">
          <VerifyButton disabled={disableCore} />
          <UploadButton disabled={disableCore} />
        </div>
      </div>
    </Fragment>
  );
}

function UploadButton({ disabled }: { disabled: boolean }) {
  const { workspace, variables, functions, deviceId, port } =
    useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [isUploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (workspace) {
      if (isUploading) {
        workspace.options.readOnly = true;
      } else {
        workspace.options.readOnly = false;
      }
    }
  }, [isUploading]);

  const onClick = async () => {
    if (workspace && deviceId) {
      setUploading(true);
      dispatch(removeToast("buildUploadResult"));
      dispatch(
        addToast({
          id: "buildUpload",
          type: "loading",
          title: "Uploading project",
        })
      );
      const raw = ArduinoGenerator.workspaceToCode(workspace);
      const code = codeFormator(raw, variables, functions);

      const result = await window.build.upload(port, deviceId, code);
      if (result.status === "success") {
        dispatch(
          addToast({
            id: "buildUploadResult",
            type: "success",
            title: result.reason,
            message: result.output,
          })
        );
        setTimeout(() => {
          dispatch(removeToast("buildUploadResult"));
        }, 10000);
      } else {
        dispatch(
          addToast({
            id: "buildUploadResult",
            type: "failure",
            title: result.reason,
            message: result.error.message,
          })
        );
      }
      dispatch(removeToast("buildUpload"));

      setUploading(false);
    }
  };

  return (
    <Button
      size="sm"
      disabled={disabled || !port || isUploading}
      onClick={onClick}
    >
      {isUploading ? (
        <Spinner size="sm" className="mr-2" />
      ) : (
        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
      )}
      Upload
    </Button>
  );
}

function VerifyButton({ disabled }: { disabled: boolean }) {
  const { workspace, variables, functions, deviceId } =
    useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [isVerifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    if (workspace) {
      if (isVerifying) {
        workspace.options.readOnly = true;
      } else {
        workspace.options.readOnly = false;
      }
    }
  }, [isVerifying]);

  const onClick = async () => {
    if (workspace && deviceId) {
      setVerifying(true);
      dispatch(removeToast("buildVerifyResult"));
      dispatch(
        addToast({
          id: "buildVerify",
          type: "loading",
          title: "Verifying project",
        })
      );
      const raw = ArduinoGenerator.workspaceToCode(workspace);
      const code = codeFormator(raw, variables, functions);

      const result = await window.build.verify(deviceId, code);
      if (result.status === "success") {
        dispatch(
          addToast({
            id: "buildVerifyResult",
            type: "success",
            title: result.reason,
            message: result.output,
          })
        );
        setTimeout(() => {
          dispatch(removeToast("buildVerifyResult"));
        }, 10000);
      } else {
        dispatch(
          addToast({
            id: "buildVerifyResult",
            type: "failure",
            title: result.reason,
            message: result.error.message,
          })
        );
      }
      dispatch(removeToast("buildVerify"));

      setVerifying(false);
    }
  };

  return (
    <Button size="sm" disabled={disabled || isVerifying} onClick={onClick}>
      {isVerifying ? (
        <Spinner size="sm" className="mr-2" />
      ) : (
        <CheckIcon className="w-5 h-5 mr-2" />
      )}
      Verify
    </Button>
  );
}

export function PortSelector() {
  const { deviceId, port } = useAppSelector(selectProject);
  const [show, setShow] = useState<boolean>(false);
  const [devices, setDevices] = useState<Array<DeviceInfo>>([]);
  const [isFetch, setFetch] = useState<boolean>(false);
  const [selectPort, setSelectPort] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (show) {
        setFetch(true);
        setDevices(await window.device.fetchDevice());
        setFetch(false);
        setSelectPort("");
      }
    })();
  }, [show]);

  return (
    <Fragment>
      {deviceId && (
        <Tooltip
          content={port ? port : "Not selected"}
          style="light"
          placement="bottom"
        >
          <Button
            size="sm"
            color={port ? "success" : "failure"}
            onClick={() => setShow(true)}
          >
            Port
          </Button>
        </Tooltip>
      )}
      <Modal show={show} onClose={() => setShow(false)} size="lg">
        <Modal.Header>
          <p className="text-blue-600 font-bold">Select Device Port</p>
        </Modal.Header>
        <Modal.Body>
          {isFetch ? (
            <div className="py-5 flex items-center justify-center gap-4 flex-col">
              <Spinner size="xl" />
              <p className="text-lg text-blue-600 font-bold">
                Scanning Connected Devices
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div id="port" className="w-full">
                <div className="mb-2 block">
                  <Label htmlFor="port" value="Select Port" />
                </div>
                <Select
                  id="port"
                  required={true}
                  value={selectPort}
                  onChange={(e) => setSelectPort(e.target.value)}
                >
                  <option value="" hidden>
                    Found {devices.length} devices.
                  </option>
                  {devices
                    .sort((a, b) => {
                      const a_board = a.matching_boards
                        ? a.matching_boards[0].fqbn
                        : undefined;
                      const b_board = b.matching_boards
                        ? b.matching_boards[0].fqbn
                        : undefined;
                      const a_weight = a_board
                        ? deviceId === a_board
                          ? 100
                          : 1
                        : -1;
                      const b_weight = b_board
                        ? deviceId === b_board
                          ? 100
                          : 1
                        : -1;
                      return b_weight - a_weight;
                    })
                    .map((device) => {
                      const board = device.matching_boards
                        ? device.matching_boards[0]
                        : undefined;
                      return (
                        <option
                          value={device.port.address}
                          key={device.port.address}
                        >
                          {`${device.port.address} ${
                            board ? ` [${board.name}]` : ""
                          }`}
                        </option>
                      );
                    })}
                </Select>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            fullSized
            onClick={() => {
              dispatch(setPort(selectPort));
              setShow(false);
            }}
          >
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export function SerialMonitor() {
  const { deviceId, port } = useAppSelector(selectProject);
  const [messages, setMessages] = useState<Array<SerialData>>([]);
  const [input, setInput] = useState<string>("");
  const [baudRate, setBaudRate] = useState<number>(9600);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const messageRef = useChatScroll(messages);

  useEffect(() => {
    (async () => {
      setOpen(await window.serial.isOpen());
      window.serial.onSerialChange((event, status) => setOpen(status));
      window.serial.onSerialData((event, data) => {
        setMessages((prev) => {
          if (
            prev.find((p) => p.timestamp.getTime() === data.timestamp.getTime())
          ) {
            return prev;
          } else {
            return [...prev, data];
          }
        });
      });
      return () => {
        window.serial.onSerialChange(undefined);
        window.serial.onSerialData(undefined);
      };
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (show && port && baudRate) {
        await window.serial.open(port, baudRate);
      } else {
        console.log(await window.serial.close());
        setMessages([]);
      }
    })();
  }, [show, port, baudRate]);

  const sendMessage = async () => {
    if (isOpen) {
      const message = `${input}\n`;
      if (await window.serial.write(message)) {
        setMessages((prev) => [
          ...prev,
          {
            timestamp: new Date(),
            message: new TextEncoder().encode(`\n${message}`),
          },
        ]);
        setInput("");
      }
    }
  };

  const disabled = deviceId === null || !port;

  return (
    <Fragment>
      <Button onClick={() => setShow(true)} disabled={disabled}>
        <ChatBubbleOvalLeftIcon className="w-4 mr-2" />
        Serial Monitor
      </Button>
      <Modal
        show={show}
        onClose={() => {
          setShow(false);
        }}
      >
        <Modal.Header>
          <p className="font-bold text-blue-600">Serial Monitor</p>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-[70vh] overflow-y-auto" ref={messageRef}>
            {messages
              .map((m) => `${new TextDecoder("utf-8").decode(m.message)}`)
              .join("")
              .split("\n")
              .map((m) => (
                <p>{m}</p>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <TextInput
            className="flex-1"
            placeholder="Write command here..."
            disabled={!isOpen}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button disabled={!isOpen} onClick={sendMessage}>
            Send
          </Button>
          <TextInput
            className="w-[100px]"
            placeholder="Baud Rate"
            type="number"
            value={baudRate}
            onChange={(e) => setBaudRate(Number(e.target.value))}
          />
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
