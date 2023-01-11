import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import AddFunctionModal from "./AddFunctionModal";
import FunctionCard from "./FunctionCard";

export default function Functions() {
  const { functions } = useAppSelector(selectProject);
  return (
    <div className="flex flex-col gap-3">
      <AddFunctionModal />
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
  );
}
