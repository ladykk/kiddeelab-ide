import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
import componentLists from "../../devices/components";
import deviceLists from "../../devices";
import { addComponent, selectProject } from "../../redux/project";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";
import ComponentPreview from "./ComponentPreview";
import { Component } from "../../types/component";
import { convertVariableName } from "../../utils/code";

export default function AddComponentModal() {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(false);
  const { pins, components, deviceId } = useAppSelector(selectProject);
  const availableComponents = componentLists.filter(
    (component) =>
      deviceId &&
      (component.supported_devices === "*" ||
        component.supported_devices.includes(deviceId))
  );
  const [selectedId, setSelectedId] = useState<string>("");
  const [form, setForm] = useState<Component | null>(null);
  const [error, setError] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    switch (e.target.id) {
      case "name":
        setForm((f) =>
          f !== null
            ? { ...f, [e.target.id]: convertVariableName(e.target.value) }
            : null
        );
        break;
      case "type":
        setForm((f) =>
          f !== null ? { ...f, [e.target.id]: e.target.value } : null
        );
        break;
      default:
        setForm((f) => {
          if (f === null) return null;
          const index = f.pins.findIndex((pin) => pin.name === e.target.id);

          if (index === -1) return f;

          return {
            ...f,
            pins: f.pins.map((pin) =>
              pin.name === e.target.id ? { ...pin, pin: e.target.value } : pin
            ),
          };
        });
        break;
    }
    setError("");
  };

  const device = deviceId ? deviceLists[deviceId] : null;
  const component = selectedId
    ? componentLists.find((component) => component.id === selectedId)
    : null;

  const availablePins = device
    ? device.pins.filter(
        (p) =>
          pins.every((pin) => pin.pin !== p) &&
          components.every((c) => c.pins.every((cp) => cp.pin !== p))
      )
    : [];

  // Update selectedId when availableComponents changes.
  useEffect(() => {
    if (show && availableComponents.length > 0) {
      const components = availableComponents.filter(
        (component) => component.pins.length <= availablePins.length
      );
      if (components.length > 0) setSelectedId(components[0].id);
    } else setSelectedId("");
  }, [show]);

  // Update form when selectedId changes.
  useEffect(() => {
    if (component) {
      setForm({
        name: convertVariableName(component.id),
        component: component.id,
        type: component.type ? component.type[0] : "",
        pins: component.pins.map((pin, i) =>
          pin.endsWith("*")
            ? {
                name: pin,
                pin: "",
              }
            : {
                name: pin,
                pin: availablePins[i] || "",
              }
        ),
      });
    } else setForm(null);
    setError("");
  }, [selectedId]);

  const handleAddComponent = (e: FormEvent) => {
    e.preventDefault();

    // Reject if no form.
    if (!form) return setError("No component selected.");

    // Reject if found duplicate pin in form.
    if (
      form.pins.some((pin) =>
        form.pins
          .filter((p) => pin.name !== p.name)
          .map((p) => p.pin)
          .includes(pin.pin)
      )
    )
      return setError("Some pins are duplicated.");

    // Reject if found duplicate pin in project.
    if (
      form.pins.some(
        (pin) =>
          pins.map((p) => p.pin).includes(pin.pin) ||
          components
            .map((c) => c.pins.map((cp) => `${c.name}_${cp.name}`))
            .some((c) => c.includes(pin.pin))
      )
    )
      return setError("Some pins are duplicated in the project.");

    dispatch(addComponent(form));
    setForm(null);
    setShow(false);
  };

  return (
    <Fragment>
      <div
        className="bg-blue-700 px-4 py-2.5 flex text-white gap-2 items-center rounded-xl hover:bg-blue-600 hover:cursor-pointer"
        onClick={() => setShow(true)}
      >
        <CubeTransparentIcon className="w-5 h-5" />
        <p className="font-semibold text-sm">Add Component</p>
      </div>
      <Modal size="2xl" show={show} onClose={() => setShow(false)}>
        <form onSubmit={handleAddComponent}>
          <Modal.Header>
            <p className="text-blue-600 font-bold">
              Add Component{" "}
              <span className="text-gray-500 text-sm">
                (Available {availablePins.length}{" "}
                {availablePins.length > 1 ? "pins." : "pin."})
              </span>
            </p>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <p className="font-bold text-lg">Components:</p>
            <div className="flex gap-3 pb-2 overflow-x-scroll">
              {componentLists.map((component) => (
                <ComponentPreview
                  component={component}
                  availablePins={availablePins.length}
                  selected={selectedId === component.id}
                  onClick={() => setSelectedId(component.id)}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {component && form ? (
                <Fragment>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="name" value="Name" />
                    </div>
                    <TextInput
                      id="name"
                      value={form.name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  {component.type && (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="type" value="Type" />
                      </div>
                      <Select
                        id="type"
                        value={form.type}
                        onChange={onChange}
                        required
                      >
                        {component.type.map((type) => (
                          <option value={type}>{type}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                    {form.pins.length !== component.pins.length ? (
                      <Spinner />
                    ) : (
                      component.pins.map((pin, i) => (
                        <div>
                          <div className="mb-2 block">
                            <Label
                              htmlFor={`pin:${pin}`}
                              value={pin.replace("*", "")}
                            />
                            {!pin.endsWith("*") && (
                              <span className="text-rose-500">*</span>
                            )}
                          </div>
                          <Select
                            id={pin}
                            value={form.pins[i].pin}
                            onChange={onChange}
                            required={!pin.endsWith("*")}
                          >
                            {pin.endsWith("*") && <option value="">-</option>}
                            {availablePins.map((pin) => (
                              <option value={pin}>{pin}</option>
                            ))}
                          </Select>
                        </div>
                      ))
                    )}
                  </div>
                </Fragment>
              ) : (
                <p className="text-gray-500 py-4">No components selected.</p>
              )}
              {error && <p className="text-red-600 font-medium">{error}</p>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {component && form ? (
              <Button fullSized type="submit">
                Add
              </Button>
            ) : (
              <Button fullSized onClick={() => setShow(false)}>
                Cancel
              </Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
}
