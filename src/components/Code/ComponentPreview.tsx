import { ComponentDetail } from "../../types/component";

export default function ComponentPreview({
  component,
  selected,
  availablePins,
  onClick,
}: {
  component: ComponentDetail;
  selected?: boolean;
  availablePins: number;
  onClick?: () => void;
}) {
  const hasOptionalPins = component.pins.some((pin) => pin.endsWith("*"));
  const requiredPins = component.pins.filter((pin) => !pin.endsWith("*"));

  const handleOnClick = () => {
    if (availablePins >= requiredPins.length && onClick) onClick();
  };
  return (
    <div
      className={`border-2 rounded-md px-3 py-4 min-w-[200px] flex flex-col gap-2 ${
        availablePins >= requiredPins.length
          ? "hover:border-blue-600 hover:cursor-pointer"
          : "hover:cursor-not-allowed"
      } ${selected ? "border-blue-600" : ""}`}
      onClick={handleOnClick}
    >
      <p className="text-blue-600 font-bold text-xl">{component.name}</p>
      <p
        className={`text-sm ${
          availablePins < component.pins.length
            ? "text-rose-500"
            : "text-gray-500"
        }`}
      >
        Required {requiredPins.length}{" "}
        {requiredPins.length > 1 ? "pins" : "pin"}.{" "}
        {hasOptionalPins && `(Max: ${component.pins.length})`}
      </p>
    </div>
  );
}
