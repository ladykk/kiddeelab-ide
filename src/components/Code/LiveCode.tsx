import { useState, useEffect, Fragment } from "react";
import ArduinoGenerator, { codeFormator } from "../../blocks/arduino";
import { selectProject, setChange, setShowCode } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import SyntaxHighlighrer from "react-syntax-highlighter";
import deviceLists from "../../devices";
import { ToggleSwitch } from "flowbite-react";

export default function LiveCode() {
  const [currentCode, setCode] = useState<string>("");
  const {
    workspace,
    pins,
    components,
    variables,
    functions,
    deviceId,
    showCode,
  } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const onWorkspaceChange = () => {
    if (workspace && deviceId) {
      const raw = ArduinoGenerator.workspaceToCode(workspace);
      setCode(
        codeFormator(
          raw,
          pins,
          components,
          variables,
          functions,
          deviceLists[deviceId]
        )
      );
      dispatch(setChange(true));
    }
  };

  useEffect(() => {
    if (workspace) {
      workspace.addChangeListener(onWorkspaceChange);
      return () => {
        workspace.removeChangeListener(onWorkspaceChange);
      };
    }
  });

  useEffect(onWorkspaceChange, [
    variables,
    functions,
    pins,
    components,
    deviceId,
  ]);

  return (
    <Fragment>
      <div
        className={`bg-gray-50 px-4 py-2 border-t flex justify-between items-center ${
          showCode ? "border-b" : ""
        }`}
      >
        <p className="text-lg font-bold text-blue-600">Code</p>
        <ToggleSwitch
          checked={showCode}
          onChange={(checked) => dispatch(setShowCode(checked))}
          label=""
        />
      </div>
      {showCode && (
        <SyntaxHighlighrer
          langauge="arduino"
          customStyle={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgb(243 244 246)",
          }}
        >
          {currentCode}
        </SyntaxHighlighrer>
      )}
    </Fragment>
  );
}
