import { Fragment, useEffect } from "react";
import { setVerify, setUpload } from "../../redux/core";
import { selectProject } from "../../redux/project";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import AddCodeModal from "./AddCodeModal";
import FunctionCard from "./FunctionCard";
import VariableCard from "./VariableCard";

export default function CodeManage() {
  const { variables, functions } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  // E - Update core when workspace change.
  useEffect(() => {
    dispatch(setVerify(false));
    dispatch(setUpload(false));
  }, [variables, functions]);

  return (
    <div>
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
        <p className="text-lg font-bold text-blue-600 ">
          Variables & Functions
        </p>
        <AddCodeModal />
      </div>
      <div className="px-3 py-4 overflow-y-auto">
        {variables.length === 0 && functions.length === 0 ? (
          <Fragment>
            <p className="text-center text-gray-500">
              No variable and function.
            </p>
          </Fragment>
        ) : (
          <div className="flex flex-col gap-3">
            {variables.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="font-bold text-gray-500">Variables</p>
                <div className="flex flex-col gap-1">
                  {variables.map((v) => (
                    <VariableCard key={v.name} info={v} />
                  ))}
                </div>
              </div>
            )}
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
        )}
      </div>
    </div>
  );
}
