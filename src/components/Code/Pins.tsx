import { Dropdown } from "flowbite-react";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import AddComponentModal from "./AddComponentModal";
import AddPinModal from "./AddPinModal";
import ComponentCard from "./ComponentCard";
import PinCard from "./PinCard";

export default function Pins() {
  const { pins, components } = useAppSelector(selectProject);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center items-center gap-3">
        <AddPinModal />
        <AddComponentModal />
      </div>

      {components.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-gray-800">Components</p>
          <div className="flex flex-col gap-1">
            {components.map((component) => (
              <ComponentCard key={component.name} component={component} />
            ))}
          </div>
        </div>
      )}
      {pins.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-gray-800">Pins</p>
          <div className="flex flex-col gap-1">
            {pins.map((v) => (
              <PinCard key={v.name} info={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
