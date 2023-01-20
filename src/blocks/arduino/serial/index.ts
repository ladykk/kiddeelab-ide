import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator, { ORDER } from "../generator";
import blocks from "./serial.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["arduino_structure"] = function (block: Block) {
  const setup: string = ArduinoGenerator.statementToCode(block, "setup");
  const loop: string = ArduinoGenerator.statementToCode(block, "loop");
  return `-> structure\nvoid setup() {\n${setup}}\n\nvoid loop() {\n${loop}}\n-> end structure`;
};

ArduinoGenerator["serial_begin"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  return `Serial.begin(${output});\n`;
};

ArduinoGenerator["serial_available"] = function (block: Block) {
  return ["Serial.available()", ORDER.ATOMIC];
};

ArduinoGenerator["serial_read_string"] = function (block: Block) {
  return ["Serial.readString()", ORDER.ATOMIC];
};

ArduinoGenerator["serial_read_string_until"] = function (block: Block) {
  const character: string = block.getFieldValue("character");
  return [`Serial.readStringUntil('${character}')`, ORDER.ATOMIC];
};

ArduinoGenerator["serial_print"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  return `Serial.print(${output});\n`;
};

ArduinoGenerator["serial_println"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  return `Serial.println(${output});\n`;
};

export default {};
