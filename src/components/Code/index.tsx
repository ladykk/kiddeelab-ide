import { useState, useEffect, Fragment } from "react";
import ArduinoGenerator, { codeFormator } from "../../blocks/arduino";
import { selectProject, setChange } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import SyntaxHighlighrer from "react-syntax-highlighter";

export default function Code() {
  const [currentCode, setCode] = useState<string>("");
  const { workspace, variables, functions, showCode } =
    useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const onWorkspaceChange = () => {
    if (workspace) {
      const raw = ArduinoGenerator.workspaceToCode(workspace);
      setCode(codeFormator(raw, variables, functions));
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

  useEffect(onWorkspaceChange, [variables, functions, showCode]);

  return showCode ? (
    <div className="max-w-[450px] w-full h-full bg-gray-100 flex flex-col z-10 border-l">
      <p className="bg-gray-50 text-lg font-bold px-4 py-2 text-blue-600 border-t border-b">
        Code
      </p>
      <SyntaxHighlighrer
        langauge="arduino"
        customStyle={{ width: "100%", backgroundColor: "rgb(243 244 246)" }}
      >
        {currentCode}
      </SyntaxHighlighrer>
    </div>
  ) : (
    <Fragment></Fragment>
  );
}
