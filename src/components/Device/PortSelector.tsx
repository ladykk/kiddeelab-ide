import { Tooltip, Button, Modal, Spinner, Label, Select } from "flowbite-react";
import { useState, useEffect, Fragment } from "react";
import { selectProject, setPort } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { DeviceInfo } from "../../types/device";

export default function PortSelector() {
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
      <Tooltip
        content={port ? port : "Not selected"}
        style="light"
        placement="bottom"
      >
        <Button
          size="sm"
          color={port ? "success" : "failure"}
          onClick={() => setShow(true)}
          disabled={!deviceId}
        >
          COM Port
        </Button>
      </Tooltip>

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
