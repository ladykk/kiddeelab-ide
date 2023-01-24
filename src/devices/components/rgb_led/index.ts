import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator from "../../../blocks/arduino";
import { ORDER } from "../../../blocks/arduino/generator";
import { ComponentDetail } from "../../../types/component";
import blocks from "./rgb_led.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["component_rgb_led_setup_anode"] = function (block: Block) {
  const pin_r = ArduinoGenerator.valueToCode(block, "pin_r", ORDER.ATOMIC);
  const pin_g = ArduinoGenerator.valueToCode(block, "pin_g", ORDER.ATOMIC);
  const pin_b = ArduinoGenerator.valueToCode(block, "pin_b", ORDER.ATOMIC);

  return `pinMode(${pin_r}, OUTPUT);\npinMode(${pin_g}, OUTPUT);\npinMode(${pin_b}, OUTPUT);\nanalogWrite(${pin_r}, 0);\nanalogWrite(${pin_g}, 0);\nanalogWrite(${pin_b}, 0);\n`;
};

ArduinoGenerator["component_rgb_led_setup_cathode"] = function (block: Block) {
  const pin_r = ArduinoGenerator.valueToCode(block, "pin_r", ORDER.ATOMIC);
  const pin_g = ArduinoGenerator.valueToCode(block, "pin_g", ORDER.ATOMIC);
  const pin_b = ArduinoGenerator.valueToCode(block, "pin_b", ORDER.ATOMIC);

  return `pinMode(${pin_r}, OUTPUT);\npinMode(${pin_g}, OUTPUT);\npinMode(${pin_b}, OUTPUT);\nanalogWrite(${pin_r}, 255);\nanalogWrite(${pin_g}, 255);\nanalogWrite(${pin_b}, 255);\n`;
};

ArduinoGenerator["component_rgb_led_set_color_anode"] = function (
  block: Block
) {
  const pin_r = ArduinoGenerator.valueToCode(block, "pin_r", ORDER.ATOMIC);
  const pin_g = ArduinoGenerator.valueToCode(block, "pin_g", ORDER.ATOMIC);
  const pin_b = ArduinoGenerator.valueToCode(block, "pin_b", ORDER.ATOMIC);
  const r = ArduinoGenerator.valueToCode(block, "r", ORDER.ATOMIC);
  const g = ArduinoGenerator.valueToCode(block, "g", ORDER.ATOMIC);
  const b = ArduinoGenerator.valueToCode(block, "b", ORDER.ATOMIC);

  return `analogWrite(${pin_r}, 255 - ${r});\nanalogWrite(${pin_g}, 255 - ${g});\nanalogWrite(${pin_b}, 255 - ${b});\n`;
};

ArduinoGenerator["component_rgb_led_set_color_cathode"] = function (
  block: Block
) {
  const pin_r = ArduinoGenerator.valueToCode(block, "pin_r", ORDER.ATOMIC);
  const pin_g = ArduinoGenerator.valueToCode(block, "pin_g", ORDER.ATOMIC);
  const pin_b = ArduinoGenerator.valueToCode(block, "pin_b", ORDER.ATOMIC);
  const r = ArduinoGenerator.valueToCode(block, "r", ORDER.ATOMIC);
  const g = ArduinoGenerator.valueToCode(block, "g", ORDER.ATOMIC);
  const b = ArduinoGenerator.valueToCode(block, "b", ORDER.ATOMIC);

  return `analogWrite(${pin_r}, ${r});\nanalogWrite(${pin_g}, ${g});\nanalogWrite(${pin_b}, ${b});\n`;
};

const RGBLED: ComponentDetail = {
  id: "rgb_led",
  name: "RGB LED",
  type: ["Anode", "Cathode"],
  pins: ["R", "G", "B"],
  supported_devices: "*",
  blocks: (component, deviceId) => {
    let blocks: Array<{ [index: string]: any }> = [
      {
        kind: "label",
        text: `${component.name} (RGB LED)`,
      },
    ];
    if (component.type === "Anode") {
      blocks.push({
        kind: "block",
        type: "component_rgb_led_setup_anode",
        inputs: {
          pin_r: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[2].pin,
              },
            },
          },
        },
      });
      blocks.push({
        kind: "block",
        type: "component_rgb_led_set_color_anode",
        inputs: {
          r: {
            block: {
              type: "number_data",
            },
          },
          g: {
            block: {
              type: "number_data",
            },
          },
          b: {
            block: {
              type: "number_data",
            },
          },
          pin_r: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[2].pin,
              },
            },
          },
        },
      });
    } else if (component.type === "Cathode") {
      blocks.push({
        kind: "block",
        type: "component_rgb_led_setup_cathode",
        inputs: {
          pin_r: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[2].pin,
              },
            },
          },
        },
      });
      blocks.push({
        kind: "block",
        type: "component_rgb_led_set_color_cathode",
        inputs: {
          r: {
            block: {
              type: "number_data",
            },
          },
          g: {
            block: {
              type: "number_data",
            },
          },
          b: {
            block: {
              type: "number_data",
            },
          },
          pin_r: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[0].pin,
              },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[1].pin,
              },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: {
                pin: component.pins[2].pin,
              },
            },
          },
        },
      });
    }

    return blocks;
  },
};

export default RGBLED;
