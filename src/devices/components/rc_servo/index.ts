import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator from "../../../blocks/arduino";
import { ORDER } from "../../../blocks/arduino/generator";
import { ComponentDetail } from "../../../types/component";
import blocks from "./rc_servo.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["component_rc_servo_attach"] = function (block: Block) {
  const servo = ArduinoGenerator.valueToCode(block, "servo", ORDER.ATOMIC);
  const pin = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `${servo}.attach(${pin});\n`;
};

ArduinoGenerator["component_rc_servo_set_angle"] = function (block: Block) {
  const servo = ArduinoGenerator.valueToCode(block, "servo", ORDER.ATOMIC);
  const angle = ArduinoGenerator.valueToCode(block, "angle", ORDER.ATOMIC);
  return `${servo}.write(${angle});\n`;
};

const RCServo: ComponentDetail = {
  id: "rc_servo",
  name: "RC Servo",
  pins: ["SIG"],
  supported_devices: "*",
  blocks: (component, deviceId) => {
    return [
      {
        kind: "label",
        text: `${component.name} (RC Servo)`,
      },
      {
        kind: "block",
        type: "component_rc_servo_attach",
        inputs: {
          servo: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.name,
              },
            },
          },
          pin: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "component_rc_servo_set_angle",
        inputs: {
          servo: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.name,
              },
            },
          },
          angle: {
            block: {
              type: "number_data",
            },
          },
        },
      },
    ];
  },
  variable_declare: (component, deviceId) => {
    return [`Servo ${component.name}`];
  },
  module_declare: (component, deviceId) => {
    return ["#include <Servo.h>"];
  },
};

export default RCServo;
