import { ComponentDetail } from "../../../types/component";

const SevenSegment: ComponentDetail = {
  id: "seven_segment",
  name: "7 Segment",
  type: ["Anode", "Cathode"],
  pins: ["A", "B", "C", "D", "E", "F", "G"],
  supported_devices: "*",
  blocks: (component, deviceId) => {
    return [];
  },
};

export default SevenSegment;
