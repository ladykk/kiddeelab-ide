import { Block, defineBlocksWithJsonArray } from "blockly";
import blocks from "./control.json";
import ArduinoGenerator, { ORDER } from "../generator";
defineBlocksWithJsonArray(blocks);

ArduinoGenerator["control_wait"] = function (block: Block) {
  const period: number = Number(
    ArduinoGenerator.valueToCode(block, "period", ORDER.ATOMIC)
  );
  const unit: string = block.getFieldValue("unit");
  return `delay(${period * (unit === "seconds" ? 1000 : 1)});\n`;
};

ArduinoGenerator["control_repeat"] = function (block: Block) {
  const round: number = Number(
    ArduinoGenerator.valueToCode(block, "round", ORDER.ATOMIC)
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `for(int reserved_counter = 0; reserved_counter < ${round}; reserved_counter++) {\n${callback}}\n`;
};

ArduinoGenerator["control_wait_until"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  return `while(!(${condition}) {}\n`;
};

ArduinoGenerator["control_if"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `if(${condition}) {\n${callback}}\n`;
};

ArduinoGenerator["control_else_if"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `else if(${condition}) {\n${callback}}\n`;
};

ArduinoGenerator["control_else"] = function (block: Block) {
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `else {\n${callback}}\n`;
};

ArduinoGenerator["control_while"] = function (block: Block) {
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  return `while(${condition}) {\n${callback}}\n`;
};

ArduinoGenerator["control_do_while"] = function (block: Block) {
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const code = `do {\n${callback}} while(${condition})\n`;
  return code;
};

ArduinoGenerator["control_for"] = function (block: Block) {
  const variable: string = ArduinoGenerator.valueToCode(
    block,
    "variable",
    ORDER.ATOMIC
  );
  const initial: number = Number(
    ArduinoGenerator.valueToCode(block, "initial", ORDER.ATOMIC)
  );
  const operator: string = block.getFieldValue("operator");
  const step: number = Number(
    ArduinoGenerator.valueToCode(block, "step", ORDER.ATOMIC)
  );
  const condition: string = ArduinoGenerator.valueToCode(
    block,
    "condition",
    ORDER.ATOMIC
  );
  const callback: string = ArduinoGenerator.statementToCode(block, "callback");
  const code = `for(${variable} = ${initial}; ${condition}; ${variable} = ${variable} ${operator} ${step}) {\n${callback}}\n`;
  return code;
};

export default {};
