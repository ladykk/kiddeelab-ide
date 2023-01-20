import { Block, CodeGenerator, defineBlocksWithJsonArray } from "blockly";

import blocks from "./generator.json";

defineBlocksWithJsonArray(blocks);

let ArduinoGenerator = new CodeGenerator("arduino");

// > Precedance Order
export const ORDER = {
  ATOMIC: 0,
  MATH_SUBFIX: 1,
  MATH_PREFIX: 2,
  MATH_MUL_DIV: 3,
  MATH_ADD_SUB: 4,
  BITWISE_SHIFT: 5,
  RELATIONAL_COMP: 6,
  RELATIONAL_EQ: 7,
  BITWISE_AND: 8,
  BITWISE_XOR: 9,
  BITWISE_OR: 10,
  LOGICAL_AND: 11,
  LOGICAL_OR: 12,
  TERNARY: 13,
  ASSIGNMENT: 14,
  COMMA: 15,
  NONE: 99,
};

// > Join blocks
// @ts-ignore
ArduinoGenerator.scrub_ = function (block, code, opt_thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !opt_thisOnly) {
    return code + ArduinoGenerator.blockToCode(nextBlock);
  }
  return code;
};

ArduinoGenerator["variable_number_get"] =
  ArduinoGenerator["variable_string_get"] =
  ArduinoGenerator["variable_boolean_get"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");

      return [`${variable}`, ORDER.ATOMIC];
    };

ArduinoGenerator["variable_number_set"] =
  ArduinoGenerator["variable_string_set"] =
  ArduinoGenerator["variable_boolean_set"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");
      const value: string = ArduinoGenerator.valueToCode(
        block,
        "value",
        ORDER.ATOMIC
      );
      return `${variable} = ${value};\n`;
    };

ArduinoGenerator["variable_number_op"] = function (block: Block) {
  const op: string = block.getFieldValue("op");
  const variable: string = block.getFieldValue("variable");
  const value: string = ArduinoGenerator.valueToCode(
    block,
    "value",
    ORDER.ATOMIC
  );

  return `${variable} = ${variable} ${op} ${value};\n`;
};

ArduinoGenerator["variable_number_get_array"] =
  ArduinoGenerator["variable_string_get_array"] =
  ArduinoGenerator["variable_boolean_get_array"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");
      const index: string = ArduinoGenerator.valueToCode(
        block,
        "index",
        ORDER.ATOMIC
      );

      return [`${variable}[${index}]`, ORDER.ATOMIC];
    };

ArduinoGenerator["variable_number_set_array"] =
  ArduinoGenerator["variable_string_set_array"] =
  ArduinoGenerator["variable_boolean_set_array"] =
    function (block: Block) {
      const variable: string = block.getFieldValue("variable");
      const index: string = ArduinoGenerator.valueToCode(
        block,
        "index",
        ORDER.ATOMIC
      );
      const value: string = ArduinoGenerator.valueToCode(
        block,
        "value",
        ORDER.ATOMIC
      );
      return `${variable}[${index}] = ${value};\n`;
    };

ArduinoGenerator["variable_number_op_array"] = function (block: Block) {
  const op: string = block.getFieldValue("op");
  const variable: string = block.getFieldValue("variable");
  const index: string = ArduinoGenerator.valueToCode(
    block,
    "index",
    ORDER.ATOMIC
  );
  const value: string = ArduinoGenerator.valueToCode(
    block,
    "value",
    ORDER.ATOMIC
  );

  return `${variable}[${index}] = ${variable} ${op} ${value};\n`;
};

ArduinoGenerator["function_declare"] = function (block: Block) {
  const func_name: string = block.getFieldValue("name");
  const statements: string = ArduinoGenerator.statementToCode(
    block,
    "statements"
  );
  const return_value: string = ArduinoGenerator.valueToCode(
    block,
    "return",
    ORDER.ATOMIC
  );

  return `-> declare function: ${func_name}\n${statements}  return${
    return_value ? ` ${return_value}` : ""
  };`;
};

ArduinoGenerator["function_void"] = function (block: Block) {
  return "";
};

export default ArduinoGenerator;
