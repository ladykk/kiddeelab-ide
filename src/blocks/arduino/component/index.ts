import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator, { ORDER } from "../generator";
import blocks from "./component.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["component_ultrasonic_read"] = function (block: Block) {
  const trig: string = ArduinoGenerator.valueToCode(
    block,
    "trig",
    ORDER.ATOMIC
  );
  const echo: string = ArduinoGenerator.valueToCode(
    block,
    "echo",
    ORDER.ATOMIC
  );

  return [`readUltrasonic(${trig}, ${echo})`, ORDER.ATOMIC];
};

ArduinoGenerator["component_dht_declare"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `-> declare dht: DHT dht(${pin}, DHT22);\n`;
};

ArduinoGenerator["component_dht_begin"] = function (block: Block) {
  return `dht.begin();\n`;
};

ArduinoGenerator["component_dht_read_humidity"] = function (block: Block) {
  return [`dht.readHumidity()`, ORDER.ATOMIC];
};

ArduinoGenerator["component_dht_read_temperature"] = function (block: Block) {
  const unit: string = block.getFieldValue("unit");
  return [`dht.readTemperature(${unit === "F" ? "true" : ""})`, ORDER.ATOMIC];
};

ArduinoGenerator["component_dht_read_heat_index"] = function (block: Block) {
  return [
    `dht.computeHeatIndex(dht.readTemperature(), dht.readHumidity(), false)`,
    ORDER.ATOMIC,
  ];
};

export default {};
