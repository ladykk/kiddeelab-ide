import { ToolboxDefinition } from "blockly/core/utils/toolbox";
import { Variable } from "./code";

export type DeviceIds = "arduino:avr:uno" | "esp32:esp32:esp32";

export type Device = {
  id: DeviceIds;
  name: string;
  platform: string;
  pins: Array<string>;
  bootRequired: boolean;
  pic?: any;
  pinout?: any;
  toolbox: ToolboxDefinition;
};

export type DeviceLists = {
  [device: string]: Device;
};

export type DeviceInfo = {
  matching_boards?: Array<{
    name: string;
    fqbn: string;
  }>;
  port: {
    address: string;
    label: string;
    protocol: string;
    protocol_label: string;
    properties?: {
      pid: string;
      serialNumber: string;
      vid: string;
    };
  };
};

export type SerialData = {
  timestamp: Date;
  message: Uint8Array;
};
