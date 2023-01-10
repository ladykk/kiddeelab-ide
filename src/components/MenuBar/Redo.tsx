import { ArrowUturnRightIcon } from "@heroicons/react/24/solid";
import { Button } from "flowbite-react";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";

export default function Redo() {
  const { workspace } = useAppSelector(selectProject);
  return (
    <Button
      size="sm"
      onClick={() => {
        if (workspace) workspace.undo(true);
      }}
    >
      <ArrowUturnRightIcon className="w-4 mr-2" />
      Redo
    </Button>
  );
}
