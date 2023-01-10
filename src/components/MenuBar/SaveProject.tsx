import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import { Dropdown } from "flowbite-react";
import { Fragment } from "react";
import { selectFile } from "../../redux/file";
import { selectProject } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { handleSaveFile } from "../../utils/file";

export default function SaveProject() {
  const project = useAppSelector(selectProject);
  const file = useAppSelector(selectFile);
  const dispatch = useAppDispatch();

  const onClick = async () => {
    if (project.deviceId) await handleSaveFile(dispatch, project, file);
  };
  return (
    <Fragment>
      <Dropdown.Item icon={ArrowDownOnSquareIcon} onClick={onClick}>
        Save
      </Dropdown.Item>
    </Fragment>
  );
}
