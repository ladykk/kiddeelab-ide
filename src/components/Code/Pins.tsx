import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import AddPinModal from "./AddPinModal";
import PinCard from "./PinCard";

export default function Pins() {
  const { pins } = useAppSelector(selectProject);
  return (
    <div className="flex flex-col gap-3">
      <AddPinModal />
      {pins.length > 0 && (
        <div className="flex flex-col gap-3">
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
