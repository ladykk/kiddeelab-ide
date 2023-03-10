import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { Toast, Spinner } from "flowbite-react";
import { useAppDispatch } from "../../redux/store";
import { removeToast } from "../../redux/toast";
import { Toast as ToastType } from "../../types/toast";

export default function Notification({ info }: { info: ToastType }) {
  const dispatch = useAppDispatch();
  return (
    <Toast>
      <div className="flex items-start gap-3 min-w-[280px] w-full">
        <div className="min-w-[26px] min-h-[26px] flex-0">
          {info.type === "loading" ? (
            <Spinner />
          ) : info.type === "success" ? (
            <CheckCircleIcon className="text-white p-0.5 bg-green-600 rounded-md" />
          ) : info.type === "failure" ? (
            <XCircleIcon className="text-white p-0.5 bg-red-600 rounded-md" />
          ) : info.type === "warning" ? (
            <ExclamationCircleIcon className="text-white p-0.5 bg-yellow-400 rounded-md" />
          ) : info.type === "update" ? (
            <ArrowPathIcon className="text-white p-0.5 bg-blue-600 rounded-md" />
          ) : (
            <InformationCircleIcon className="text-white p-0.5 bg-blue-600 rounded-md" />
          )}
        </div>
        <div className="flex flex-col w-[70%] gap-1 flex-1">
          <p className=" min-h-[1.5rem] text-gray-700 font-medium">
            {info.title}
          </p>
          {info.message && (
            <p className="text-sm text-clip overflow-hidden">{info.message}</p>
          )}
        </div>
        {info.type !== "loading" && (
          <div
            className="flex-0"
            onClick={() => dispatch(removeToast(info.id))}
          >
            <Toast.Toggle />
          </div>
        )}
      </div>
    </Toast>
  );
}
