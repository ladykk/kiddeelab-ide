import { ArrowDownOnSquareStackIcon } from "@heroicons/react/24/solid";
import { Dropdown } from "flowbite-react";
import { Fragment } from "react";
import { selectProject } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { handleSaveFile } from "../../utils/file";

export default function SaveAsProject() {
  const project = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const onClick = async () => {
    if (project.deviceId) await handleSaveFile(dispatch, project);
  };

  return (
    <Fragment>
      <Dropdown.Item icon={ArrowDownOnSquareStackIcon} onClick={onClick}>
        Save As
      </Dropdown.Item>
    </Fragment>
  );
}
