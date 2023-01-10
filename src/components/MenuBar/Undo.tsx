import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "flowbite-react";
import { selectProject } from "../../redux/project";
import { useAppSelector } from "../../redux/store";

export default function Undo() {
  const { workspace } = useAppSelector(selectProject);
  return (
    <Button
      size="sm"
      onClick={() => {
        if (workspace) workspace.undo(false);
      }}
    >
      <ArrowUturnLeftIcon className="w-4 mr-2" />
      Undo
    </Button>
  );
}
