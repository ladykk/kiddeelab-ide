import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator from "../../../blocks/arduino";
import { ORDER } from "../../../blocks/arduino/generator";
import { ComponentDetail } from "../../../types/component";

import blocks from "./dc_motor.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["component_dc_motor_setup"] = function (block: Block) {
  const dir1 = ArduinoGenerator.valueToCode(block, "dir1", ORDER.ATOMIC);
  const dir2 = ArduinoGenerator.valueToCode(block, "dir2", ORDER.ATOMIC);
  const pwm = ArduinoGenerator.valueToCode(block, "pwm", ORDER.ATOMIC);
  return `pinMode(${dir1}, OUTPUT);\npinMode(${dir2}, OUTPUT);\npinMode(${pwm}, OUTPUT);\n`;
};

ArduinoGenerator["component_dc_motor_run"] = function (block: Block) {
  const dir1 = ArduinoGenerator.valueToCode(block, "dir1", ORDER.ATOMIC);
  const dir2 = ArduinoGenerator.valueToCode(block, "dir2", ORDER.ATOMIC);
  const pwm = ArduinoGenerator.valueToCode(block, "pwm", ORDER.ATOMIC);
  const speed = ArduinoGenerator.valueToCode(block, "speed", ORDER.ATOMIC);
  const direction = block.getFieldValue("direction");
  return `${
    direction === "clockwise"
      ? `digitalWrite(${dir1}, HIGH);\ndigitalWrite(${dir2}, LOW);\n`
      : `digitalWrite(${dir1}, LOW);\ndigitalWrite(${dir2}, HIGH);\n`
  }analogWrite(${pwm}, 255 / 100 * ${speed});\n`;
};

ArduinoGenerator["component_dc_motor_stop"] = function (block: Block) {
  const dir1 = ArduinoGenerator.valueToCode(block, "dir1", ORDER.ATOMIC);
  const dir2 = ArduinoGenerator.valueToCode(block, "dir2", ORDER.ATOMIC);
  const pwm = ArduinoGenerator.valueToCode(block, "pwm", ORDER.ATOMIC);
  return `digitalWrite(${dir1}, LOW);\ndigitalWrite(${dir2}, LOW);\nanalogWrite(${pwm}, 0);\n`;
};

const DCMotor: ComponentDetail = {
  id: "dc_motor",
  name: "DC Motor",
  pins: ["DIR1", "DIR2", "PWM"],
  supported_devices: "*",
  blocks: (component, deviceId) => {
    return [
      {
        kind: "label",
        text: `${component.name} (DC Motor)`,
      },
      {
        kind: "block",
        type: "component_dc_motor_setup",
        inputs: {
          dir1: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          dir2: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
          pwm: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[2].pin,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "component_dc_motor_run",
        inputs: {
          dir1: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          dir2: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
          pwm: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[2].pin,
              },
            },
          },
          speed: {
            block: {
              type: "number_data",
            },
          },
        },
      },
      {
        kind: "block",
        type: "component_dc_motor_stop",
        inputs: {
          dir1: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          dir2: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
          pwm: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[2].pin,
              },
            },
          },
        },
      },
    ];
  },
};

export default DCMotor;
