import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";
import AddVariableModal from "./AddVariableModal";
import VariableCard from "./VariableCard";

export default function Variables() {
  const { variables } = useAppSelector(selectProject);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center items-center gap-3">
        <AddVariableModal />
      </div>
      {variables.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {variables.map((v) => (
              <VariableCard key={v.name} info={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
