import { Fragment, useEffect, useState } from "react";
import { setVerify, setUpload } from "../../redux/core";
import { selectProject } from "../../redux/project";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import Functions from "./Functions";
import Pins from "./Pins";
import Variables from "./Variables";

const CODE_MENUS = ["Pins", "Variables", "Functions"];

export default function CodeManage() {
  const { variables, functions } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const [menu, setMenu] = useState(CODE_MENUS[0]);

  // E - Update core when workspace change.
  useEffect(() => {
    dispatch(setVerify(false));
    dispatch(setUpload(false));
  }, [variables, functions]);

  return (
    <Fragment>
      <div className="bg-gray-50 border-b flex items-center h-12">
        {CODE_MENUS.map((m, index) => (
          <p
            key={index}
            className={`h-full font-semibold  px-5 py-2 pt-3 hover:cursor-pointer hover:bg-gray-100 ${
              m === menu
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setMenu(m)}
          >
            {m}
          </p>
        ))}
      </div>
      <div className="px-3 py-4 overflow-y-auto bg-gray-100 flex-1">
        {menu === "Pins" ? (
          <Pins />
        ) : menu === "Variables" ? (
          <Variables />
        ) : (
          <Functions />
        )}
      </div>
    </Fragment>
  );
}
