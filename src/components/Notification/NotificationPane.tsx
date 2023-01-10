import { useAppSelector } from "../../redux/store";
import { selectToasts } from "../../redux/toast";
import Notification from "./Notification";

export default function NotificationPane() {
  const toasts = useAppSelector(selectToasts);
  return (
    <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
      {toasts.map((toast) => (
        <Notification key={toast.id} info={toast} />
      ))}
    </div>
  );
}
