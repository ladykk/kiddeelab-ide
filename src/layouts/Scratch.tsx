import { CodeBracketIcon } from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";

function Scratch() {
  const [show, setShow] = useState<boolean>(true);
  return (
    <Fragment>
      <div
        className={`z-20 fixed right-0 top-[15%] hover:cursor-pointer hover:opacity-80 px-1 h-20 rounded-l-2xl flex items-center justify-center border-2 shadow-lg border-r-0 ${
          show
            ? "bg-white border-blue-500 hover:bg-blue-100"
            : "bg-blue-500 border-blue-500"
        }`}
        onClick={() => setShow((s) => !s)}
      >
        <CodeBracketIcon
          className={`w-5 h-5 ${show ? "text-blue-500" : "text-white"}`}
        />
      </div>
      <iframe
        src="/scratch.html"
        className={`w-screen h-screen top-0 left-0 right-0 bottom-0 bg-white z-10 ${
          show ? "fixed" : "hidden"
        }`}
      />
    </Fragment>
  );
}

export default Scratch;
