import { defineBlocksWithJsonArray, Block } from "blockly";
import ArduinoGenerator from "../../../blocks/arduino";
import { ORDER } from "../../../blocks/arduino/generator";
import { ComponentDetail } from "../../../types/component";
import blocks from "./dht.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["component_dht_begin"] = function (block: Block) {
  const name: string = ArduinoGenerator.valueToCode(
    block,
    "name",
    ORDER.ATOMIC
  );
  return `${name}.begin();\n`;
};

ArduinoGenerator["component_dht_read_humidity"] = function (block: Block) {
  const name: string = ArduinoGenerator.valueToCode(
    block,
    "name",
    ORDER.ATOMIC
  );

  return [`${name}.readHumidity()`, ORDER.ATOMIC];
};

ArduinoGenerator["component_dht_read_temperature"] = function (block: Block) {
  const unit: string = block.getFieldValue("unit");
  const name: string = ArduinoGenerator.valueToCode(
    block,
    "name",
    ORDER.ATOMIC
  );

  return [
    `${name}.readTemperature(${unit === "F" ? "true" : ""})`,
    ORDER.ATOMIC,
  ];
};

ArduinoGenerator["component_dht_read_heat_index"] = function (block: Block) {
  const name: string = ArduinoGenerator.valueToCode(
    block,
    "name",
    ORDER.ATOMIC
  );

  return [
    `${name}.computeHeatIndex(${name}.readTemperature(), ${name}.readHumidity(), false)`,
    ORDER.ATOMIC,
  ];
};

const DHT: ComponentDetail = {
  id: "dht",
  name: "Temperature & Humidity",
  pins: ["PIN"],
  supported_devices: "*",
  blocks(component, deviceId) {
    return [
      {
        kind: "label",
        text: `${component.name} (Temperature & Humidity)`,
      },
      {
        kind: "block",
        type: "component_dht_begin",
        inputs: {
          name: {
            block: {
              type: "pin_define",
              fields: { pin: component.name },
            },
          },
        },
      },
      {
        kind: "block",
        type: "component_dht_read_humidity",
        inputs: {
          name: {
            block: {
              type: "pin_define",
              fields: { pin: component.name },
            },
          },
        },
      },
      {
        kind: "block",
        type: "component_dht_read_temperature",
        inputs: {
          name: {
            block: {
              type: "pin_define",
              fields: { pin: component.name },
            },
          },
        },
      },
      {
        kind: "block",
        type: "component_dht_read_heat_index",
        inputs: {
          name: {
            block: {
              type: "pin_define",
              fields: { pin: component.name },
            },
          },
        },
      },
    ];
  },
  module_declare: (component, deviceId) => ["include <DHT.h>"],
  variable_declare: (compnent, deviceId) => [
    `DHT ${compnent.name}(${compnent.pins[0].pin}, DHT22)`,
  ],
};

export default DHT;
