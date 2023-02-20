import { Block, defineBlocksWithJsonArray } from "blockly";
import ArduinoGenerator, { ORDER } from "../generator";
import blocks from "./number.json";

defineBlocksWithJsonArray(blocks);

ArduinoGenerator["number_op2"] = function (block: Block) {
  const number1 = ArduinoGenerator.valueToCode(block, "number1", ORDER.ATOMIC);
  const operator: string = block.getFieldValue("operator");
  const number2 = ArduinoGenerator.valueToCode(block, "number2", ORDER.ATOMIC);
  switch (operator) {
    case "+":
      return [`${number1} + ${number2}`, ORDER.MATH_ADD_SUB];
    case "-":
      return [`${number1} - ${number2}`, ORDER.MATH_ADD_SUB];
    case "*":
      return [`${number1} * ${number2}`, ORDER.MATH_MUL_DIV];
    case "/":
      return [`(float) ${number1} / (float) ${number2}`, ORDER.MATH_MUL_DIV];
    case "%":
      return [`${number1} % ${number2}`, ORDER.MATH_MUL_DIV];
    default:
      return ["/* Unhandle */", ORDER.NONE];
  }
};

// TODO: implement include math.h
ArduinoGenerator["number_op1"] = function (block: Block) {
  const operator: string = block.getFieldValue("operator");
  const number = ArduinoGenerator.valueToCode(block, "number", ORDER.ATOMIC);
  switch (operator) {
    case "absolute":
      return [`abs(${number})`, ORDER.ATOMIC];
    case "round up":
      return [`ceil(${number})`, ORDER.ATOMIC];
    case "round down":
      return [`floor(${number})`, ORDER.ATOMIC];
    default:
      return ["/* Unhandle */", ORDER.NONE];
  }
};

ArduinoGenerator["number_random"] = function (block: Block) {
  const start = ArduinoGenerator.valueToCode(block, "start", ORDER.ATOMIC);
  const end = ArduinoGenerator.valueToCode(block, "end", ORDER.ATOMIC);
  return [`random(${start}, ${end})`, ORDER.ATOMIC];
};

ArduinoGenerator["number_data"] = function (block: Block) {
  const output = block.getFieldValue("output");
  return [`${output}`, ORDER.ATOMIC];
};

ArduinoGenerator["number_compare"] = function (block: Block) {
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

export default {};
