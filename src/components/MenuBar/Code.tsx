import { Button, ToggleSwitch } from "flowbite-react";
import { selectProject, setShowCode } from "../../redux/project";
import { useAppDispatch, useAppSelector } from "../../redux/store";

export default function CodeToggle() {
  const { showCode, deviceId } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const handleCodeSwitch = () => {
    dispatch(setShowCode(!showCode));
  };
  return (
    <Button
      size="sm"
      color="light"
      onClick={handleCodeSwitch}
      disabled={!deviceId}
    >
      {" "}
      <ToggleSwitch
        checked={showCode}
        onChange={() => {}}
        label="Code"
        disabled={!deviceId}
      />
    </Button>
  );
}
