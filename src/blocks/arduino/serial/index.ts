import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator, { ORDER } from "../generator";
import blocks from "./serial.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["serial_begin"] = function (block: Block) {
  const baudrate: string = block.getFieldValue("baudrate");
  return `Serial.begin(${baudrate});\n`;
};

ArduinoGenerator["serial_available"] = function (block: Block) {
  return ["Serial.available()", ORDER.ATOMIC];
};

ArduinoGenerator["serial_read_string"] = function (block: Block) {
  return ["Serial.readStringUntil('\\n')", ORDER.ATOMIC];
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
