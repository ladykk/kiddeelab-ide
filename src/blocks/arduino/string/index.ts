import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator, { ORDER } from "../generator";
import blocks from "./string.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["string_data"] = function (block: Block) {
  const output: string = block.getFieldValue("output");
  return [`"${output}"`, ORDER.ATOMIC];
};

ArduinoGenerator["join_string"] = function (block: Block) {
  const base = ArduinoGenerator.valueToCode(block, "base", ORDER.ATOMIC);
  const add = ArduinoGenerator.valueToCode(block, "add", ORDER.ATOMIC);
  return [`${base} + ${add}`, ORDER.ATOMIC];
};

ArduinoGenerator["char_at"] = function (block: Block) {
  const index: number = Number(block.getFieldValue("index"));
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  return [`${base}.charAt(${index})`, ORDER.ATOMIC];
};

ArduinoGenerator["string_length"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  return [`${base}.length()`, ORDER.ATOMIC];
};

ArduinoGenerator["string_compare"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  const comparator: string = ArduinoGenerator.valueToCode(
    block,
    "comparator",
    ORDER.ATOMIC
  );
  return [`${base}.equals(${comparator})`, ORDER.ATOMIC];
};

export default {};
