import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator from "../../../blocks/arduino";
import { ORDER } from "../../../blocks/arduino/generator";
import { ComponentDetail } from "../../../types/component";
import blocks from "./seven_segment.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["component_seven_segment_setup_anode"] = function (
  block: Block
) {
  const pin_a: string = ArduinoGenerator.valueToCode(
    block,
    "pin_a",
    ORDER.ATOMIC
  );
  const pin_b: string = ArduinoGenerator.valueToCode(
    block,
    "pin_b",
    ORDER.ATOMIC
  );
  const pin_c: string = ArduinoGenerator.valueToCode(
    block,
    "pin_c",
    ORDER.ATOMIC
  );
  const pin_d: string = ArduinoGenerator.valueToCode(
    block,
    "pin_d",
    ORDER.ATOMIC
  );
  const pin_e: string = ArduinoGenerator.valueToCode(
    block,
    "pin_e",
    ORDER.ATOMIC
  );
  const pin_f: string = ArduinoGenerator.valueToCode(
    block,
    "pin_f",
    ORDER.ATOMIC
  );
  const pin_g: string = ArduinoGenerator.valueToCode(
    block,
    "pin_g",
    ORDER.ATOMIC
  );

  return `pinMode(${pin_a}, OUTPUT);\npinMode(${pin_b}, OUTPUT);\npinMode(${pin_c}, OUTPUT);\npinMode(${pin_d}, OUTPUT);\npinMode(${pin_e}, OUTPUT);\npinMode(${pin_f}, OUTPUT);\npinMode(${pin_g}, OUTPUT);\ndigitalWrite(${pin_a}, LOW);\ndigitalWrite(${pin_b}, LOW);\ndigitalWrite(${pin_c}, LOW);\ndigitalWrite(${pin_d}, LOW);\ndigitalWrite(${pin_e}, LOW);\ndigitalWrite(${pin_f}, LOW);\ndigitalWrite(${pin_g}, LOW);\n`;
};

ArduinoGenerator["component_seven_segment_setup_cathode"] = function (
  block: Block
) {
  const pin_a: string = ArduinoGenerator.valueToCode(
    block,
    "pin_a",
    ORDER.ATOMIC
  );
  const pin_b: string = ArduinoGenerator.valueToCode(
    block,
    "pin_b",
    ORDER.ATOMIC
  );
  const pin_c: string = ArduinoGenerator.valueToCode(
    block,
    "pin_c",
    ORDER.ATOMIC
  );
  const pin_d: string = ArduinoGenerator.valueToCode(
    block,
    "pin_d",
    ORDER.ATOMIC
  );
  const pin_e: string = ArduinoGenerator.valueToCode(
    block,
    "pin_e",
    ORDER.ATOMIC
  );
  const pin_f: string = ArduinoGenerator.valueToCode(
    block,
    "pin_f",
    ORDER.ATOMIC
  );
  const pin_g: string = ArduinoGenerator.valueToCode(
    block,
    "pin_g",
    ORDER.ATOMIC
  );

  return `pinMode(${pin_a}, OUTPUT);\npinMode(${pin_b}, OUTPUT);\npinMode(${pin_c}, OUTPUT);\npinMode(${pin_d}, OUTPUT);\npinMode(${pin_e}, OUTPUT);\npinMode(${pin_f}, OUTPUT);\npinMode(${pin_g}, OUTPUT);\ndigitalWrite(${pin_a}, HIGH);\ndigitalWrite(${pin_b}, HIGH);\ndigitalWrite(${pin_c}, HIGH);\ndigitalWrite(${pin_d}, HIGH);\ndigitalWrite(${pin_e}, HIGH);\ndigitalWrite(${pin_f}, HIGH);\ndigitalWrite(${pin_g}, HIGH);\n`;
};

ArduinoGenerator["component_seven_segment_set_number_anode"] = function (
  block: Block
) {
  const pin_a: string = ArduinoGenerator.valueToCode(
    block,
    "pin_a",
    ORDER.ATOMIC
  );
  const pin_b: string = ArduinoGenerator.valueToCode(
    block,
    "pin_b",
    ORDER.ATOMIC
  );
  const pin_c: string = ArduinoGenerator.valueToCode(
    block,
    "pin_c",
    ORDER.ATOMIC
  );
  const pin_d: string = ArduinoGenerator.valueToCode(
    block,
    "pin_d",
    ORDER.ATOMIC
  );
  const pin_e: string = ArduinoGenerator.valueToCode(
    block,
    "pin_e",
    ORDER.ATOMIC
  );
  const pin_f: string = ArduinoGenerator.valueToCode(
    block,
    "pin_f",
    ORDER.ATOMIC
  );
  const pin_g: string = ArduinoGenerator.valueToCode(
    block,
    "pin_g",
    ORDER.ATOMIC
  );
  const num: string = ArduinoGenerator.valueToCode(block, "num", ORDER.ATOMIC);

  return `setAnodeSevenSegment(${pin_a}, ${pin_b}, ${pin_c}, ${pin_d}, ${pin_e}, ${pin_f}, ${pin_g}, ${num});\n`;
};

ArduinoGenerator["component_seven_segment_set_number_cathode"] = function (
  block: Block
) {
  const pin_a: string = ArduinoGenerator.valueToCode(
    block,
    "pin_a",
    ORDER.ATOMIC
  );
  const pin_b: string = ArduinoGenerator.valueToCode(
    block,
    "pin_b",
    ORDER.ATOMIC
  );
  const pin_c: string = ArduinoGenerator.valueToCode(
    block,
    "pin_c",
    ORDER.ATOMIC
  );
  const pin_d: string = ArduinoGenerator.valueToCode(
    block,
    "pin_d",
    ORDER.ATOMIC
  );
  const pin_e: string = ArduinoGenerator.valueToCode(
    block,
    "pin_e",
    ORDER.ATOMIC
  );
  const pin_f: string = ArduinoGenerator.valueToCode(
    block,
    "pin_f",
    ORDER.ATOMIC
  );
  const pin_g: string = ArduinoGenerator.valueToCode(
    block,
    "pin_g",
    ORDER.ATOMIC
  );
  const num: string = ArduinoGenerator.valueToCode(block, "num", ORDER.ATOMIC);

  return `setCathodeSevenSegment(${pin_a}, ${pin_b}, ${pin_c}, ${pin_d}, ${pin_e}, ${pin_f}, ${pin_g}, ${num});\n`;
};

const SevenSegment: ComponentDetail = {
  id: "seven_segment",
  name: "7 Segment",
  type: ["Anode", "Cathode"],
  pins: ["A", "B", "C", "D", "E", "F", "G"],
  supported_devices: "*",
  blocks: (component, deviceId) => {
    let blocks: Array<{ [index: string]: any }> = [
      {
        kind: "label",
        text: `${component.name} (7 Segment)`,
      },
    ];
    if (component.type === "Anode") {
      blocks.push({
        kind: "block",
        type: "component_seven_segment_setup_anode",
        inputs: {
          pin_a: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[0].pin },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[1].pin },
            },
          },
          pin_c: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[2].pin },
            },
          },
          pin_d: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[3].pin },
            },
          },
          pin_e: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[4].pin },
            },
          },
          pin_f: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[5].pin },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[6].pin },
            },
          },
        },
      });
      blocks.push({
        kind: "block",
        type: "component_seven_segment_set_number_anode",
        inputs: {
          num: {
            block: {
              type: "number_data",
              fields: { num: 0 },
            },
          },
          pin_a: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[0].pin },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[1].pin },
            },
          },
          pin_c: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[2].pin },
            },
          },
          pin_d: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[3].pin },
            },
          },
          pin_e: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[4].pin },
            },
          },
          pin_f: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[5].pin },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[6].pin },
            },
          },
        },
      });
    } else if (component.type === "Cathode") {
      blocks.push({
        kind: "block",
        type: "component_seven_segment_setup_cathode",
        inputs: {
          pin_a: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[0].pin },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[1].pin },
            },
          },
          pin_c: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[2].pin },
            },
          },
          pin_d: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[3].pin },
            },
          },
          pin_e: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[4].pin },
            },
          },
          pin_f: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[5].pin },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[6].pin },
            },
          },
        },
      });
      blocks.push({
        kind: "block",
        type: "component_seven_segment_set_number_cathode",
        inputs: {
          num: {
            block: {
              type: "number_data",
              fields: { num: 0 },
            },
          },
          pin_a: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[0].pin },
            },
          },
          pin_b: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[1].pin },
            },
          },
          pin_c: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[2].pin },
            },
          },
          pin_d: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[3].pin },
            },
          },
          pin_e: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[4].pin },
            },
          },
          pin_f: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[5].pin },
            },
          },
          pin_g: {
            block: {
              type: "pin_define",
              fields: { pin: component.pins[6].pin },
            },
          },
        },
      });
    }
    return blocks;
  },
  function_declare(component, deviceId) {
    if (component.type === "Anode")
      return [
        "void setAnodeSevenSegment(int pin_a, int pin_b, int pin_c, int pin_d, int pin_e, int pin_f, int pin_g, int number) {\n  int numbers[10][7] = {\n    {0, 0, 0, 0, 0, 0, 1},\n    {1, 0, 0, 1, 1, 1, 1},\n    {0, 0, 1, 0, 0, 1, 0},\n    {0, 0, 0, 0, 1, 1, 0},\n    {1, 0, 0, 1, 1, 0, 0},\n    {0, 1, 0, 0, 1, 0, 0},\n    {0, 1, 0, 0, 0, 0, 0},\n    {0, 0, 0, 1, 1, 1, 1},\n    {0, 0, 0, 0, 0, 0, 0},\n    {0, 0, 0, 0, 1, 0, 0},\n  };\n  if(number < 0 || number > 9) {\n    digitalWrite(pin_a, 0);\n    digitalWrite(pin_b, 0);\n    digitalWrite(pin_c, 0);\n    digitalWrite(pin_d, 0);\n    digitalWrite(pin_e, 0);\n    digitalWrite(pin_f, 0);\n    digitalWrite(pin_g, 0);\n  } else {\n    digitalWrite(pin_a, numbers[number][0]);\n    digitalWrite(pin_b, numbers[number][1]);\n    digitalWrite(pin_c, numbers[number][2]);\n    digitalWrite(pin_d, numbers[number][3]);\n    digitalWrite(pin_e, numbers[number][4]);\n    digitalWrite(pin_f, numbers[number][5]);\n    digitalWrite(pin_g, numbers[number][6]);\n  }\n}",
      ];
    else if (component.type === "Cathode")
      return [
        "void setCathodeSevenSegment(int pin_a, int pin_b, int pin_c, int pin_d, int pin_e, int pin_f, int pin_g, int number) {\n  int numbers[10][7] = {\n    {1, 1, 1, 1, 1, 1, 0},\n    {0, 1, 1, 0, 0, 0, 0},\n    {1, 1, 0, 1, 1, 0, 1},\n    {1, 1, 1, 1, 0, 0, 1},\n    {0, 1, 1, 0, 0, 1, 1},\n    {1, 0, 1, 1, 0, 1, 1},\n    {1, 0, 1, 1, 1, 1, 1},\n    {1, 1, 1, 0, 0, 0, 0},\n    {1, 1, 1, 1, 1, 1, 1},\n    {1, 1, 1, 1, 0, 1, 1},\n  };\n  if(number < 0 || number > 9) {\n    digitalWrite(pin_a, 1);\n    digitalWrite(pin_b, 1);\n    digitalWrite(pin_c, 1);\n    digitalWrite(pin_d, 1);\n    digitalWrite(pin_e, 1);\n    digitalWrite(pin_f, 1);\n    digitalWrite(pin_g, 1);\n  } else {\n    digitalWrite(pin_a, numbers[number][0]);\n    digitalWrite(pin_b, numbers[number][1]);\n    digitalWrite(pin_c, numbers[number][2]);\n    digitalWrite(pin_d, numbers[number][3]);\n    digitalWrite(pin_e, numbers[number][4]);\n    digitalWrite(pin_f, numbers[number][5]);\n    digitalWrite(pin_g, numbers[number][6]);\n  }\n}",
      ];
    else return [];
  },
};

export default SevenSegment;
