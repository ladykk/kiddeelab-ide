import { Pin } from "./code";
import { DeviceIds } from "./device";

export type ComponentLists =
  | "buzzer"
  | "dc_motor"
  | "dht"
  | "rc_servo"
  | "rgb_led"
  | "seven_segment"
  | "ultrasonic";

export type ComponentDetail = {
  id: ComponentLists;
  name: string;
  type?: Array<string>;
  pins: Array<string>;
  supported_devices: Array<DeviceIds> | "*";
  blocks: (
    component: Component,
    deviceId: DeviceIds | null
  ) => Array<{ [index: string]: any }>;
  function_declare?: (
    component: Component,
    deviceId: DeviceIds
  ) => Array<string>;
  variable_declare?: (
    component: Component,
    deviceId: DeviceIds
  ) => Array<string>;
  module_declare?: (component: Component, deviceId: DeviceIds) => Array<string>;
  define_declare?: (component: Component, deviceId: DeviceIds) => Array<string>;
};

export type Component = {
  name: string;
  component: ComponentLists;
  type: string;
  pins: Array<Pin>;
};
