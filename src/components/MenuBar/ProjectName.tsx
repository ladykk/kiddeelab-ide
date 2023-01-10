import { DocumentIcon } from "@heroicons/react/24/solid";
import { Tooltip, TextInput, Badge } from "flowbite-react";
import { selectFile } from "../../redux/file";
import { selectProject, setProjectName } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";

export default function ProjectName() {
  const { projectName, isChange } = useAppSelector(selectProject);
  const file = useAppSelector(selectFile);
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center gap-2 flex-1 justify-center">
      {file && (
        <Tooltip content={file} placement="bottom" style="light">
          <DocumentIcon className="text-white w-6 h-6 p-0.5" />
        </Tooltip>
      )}
      <TextInput
        value={projectName}
        onChange={(e) => dispatch(setProjectName(e.target.value))}
        sizing="sm"
        placeholder="Untitle Project"
        className="w-[200px]"
      />
      {file && (
        <Badge color={isChange ? "warning" : "success"} size="sm">
          {isChange ? "Unsaved" : "Saved"}
        </Badge>
      )}
    </div>
  );
}
