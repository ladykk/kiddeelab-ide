import { Button } from "flowbite-react";
import { selectCore, setPlatformLists } from "../../redux/core";
import { selectProject, setDeviceId } from "../../redux/project";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { addToast, removeToast } from "../../redux/toast";
import { Device } from "../../types/device";

export default function DeviceCard({
  device,
  handleModal,
}: {
  device: Device;
  handleModal: () => void;
}) {
  const { deviceId } = useAppSelector(selectProject);
  const { platformLists } = useAppSelector(selectCore);
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(setDeviceId(device.id));
    handleModal();
    if (!platformLists.includes(device.platform)) {
      (async () => {
        dispatch(
          addToast({
            id: `installCore:${device.id}`,
            type: "loading",
            title: `Loading dependencies for ${device.name}`,
          })
        );
        await window.core
          .installCore(device.platform)
          .then((result) => {
            if (result) {
              dispatch(
                addToast({
                  id: `installCoreStatus:${device.id}`,
                  type: "success",
                  title: `Dependencies installed`,
                })
              );
            } else {
              dispatch(
                addToast({
                  id: `installCoreStatus:${device.id}`,
                  type: "failure",
                  title: `Dependencies cannot be installed`,
                })
              );
            }
          })
          .catch((err) => {
            dispatch(
              addToast({
                id: `installCoreStatus:${device.id}`,
                type: "failure",
                title: `Dependencies cannot be installed`,
              })
            );
          })
          .finally(async () => {
            dispatch(removeToast(`installCore:${device.id}`));
            setTimeout(
              () => dispatch(removeToast(`installCoreStatus:${device.id}`)),
              5000
            );
            const platforms = await window.core.installList();
            dispatch(setPlatformLists(platforms));
          });
      })();
    }
  };
  return (
    <div className="border p-5 rounded-md shadow h-72 flex flex-col justify-between gap-3">
      <img src={device.pic} alt={device.name} className="my-auto" />
      <div className="flex flex-col gap-3">
        <p className="font-medium text-lg text-center">{device.name}</p>
        <Button onClick={onClick} disabled={deviceId === device.id}>
          {deviceId === device.id ? "Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
}
