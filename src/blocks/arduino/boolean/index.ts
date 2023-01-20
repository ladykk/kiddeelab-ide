import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator, { ORDER } from "../generator";
import blocks from "./boolean.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["boolean_data"] = function (block: Block) {
  const output: string = block.getFieldValue("output");
  switch (output) {
    case "true":
      return ["true", ORDER.ATOMIC];
    case "false":
      return ["false", ORDER.ATOMIC];
    default:
      return ["/* Unhandle */", ORDER.NONE];
  }
};

ArduinoGenerator["boolean_op"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  const operator: string = block.getFieldValue("operator");
  const comparator: string = ArduinoGenerator.valueToCode(
    block,
    "comparator",
    ORDER.ATOMIC
  );
  return [`${base} ${operator} ${comparator}`, ORDER.ATOMIC];
};

ArduinoGenerator["boolean_not"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  return [`!(${base})`, ORDER.ATOMIC];
};

ArduinoGenerator["boolean_compare"] = function (block: Block) {
  const base: string = ArduinoGenerator.valueToCode(
    block,
    "base",
    ORDER.ATOMIC
  );
  const value: string = block.getFieldValue("value");
  return [`${base} == ${value}`, ORDER.ATOMIC];
};

export default {};
