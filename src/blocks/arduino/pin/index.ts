import { defineBlocksWithJsonArray, Block } from "blockly";
import ArduinoGenerator, { ORDER } from "../generator";
import blocks from "./pin.json";

defineBlocksWithJsonArray(blocks);

// Arduino blocks.
ArduinoGenerator["arduino_structure"] = function (block: Block) {
  const setup: string = ArduinoGenerator.statementToCode(block, "setup");
  const loop: string = ArduinoGenerator.statementToCode(block, "loop");
  return `-> setup\nvoid setup() {\n${setup}}\n-> end\n-> loop\nvoid loop() {\n${loop}}\n-> end`;
};

ArduinoGenerator["arduino_setup"] = function (block: Block) {
  const setup: string = ArduinoGenerator.statementToCode(block, "setup");
  return `-> setup\nvoid setup() {\n${setup}}\n-> end`;
};

ArduinoGenerator["arduino_loop"] = function (block: Block) {
  const loop: string = ArduinoGenerator.statementToCode(block, "loop");
  return `-> loop\nvoid loop() {\n${loop}}\n-> end`;
};

// Pin blocks.
ArduinoGenerator["pin_mode"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  const mode: string = block.getFieldValue("mode");
  return `pinMode(${pin}, ${mode});\n`;
};

ArduinoGenerator["pin_define"] = function (block: Block) {
  var pin = block.getFieldValue("pin");
  return [`${pin}`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_digital_read"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return [`digitalRead(${pin})`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_digital_write"] = function (block: Block) {
  const output: string = ArduinoGenerator.valueToCode(
    block,
    "output",
    ORDER.ATOMIC
  );
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `digitalWrite(${pin}, ${output});\n`;
};

ArduinoGenerator["pin_digital_output"] = function (block: Block) {
  const output: string = block.getFieldValue("output");
  return [output === "true" ? "HIGH" : "LOW", ORDER.ATOMIC];
};

ArduinoGenerator["pin_analog_read"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return [`analogRead(${pin})`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_analog_write"] = function (block: Block) {
  const output = ArduinoGenerator.valueToCode(block, "output", ORDER.ATOMIC);
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `analogWrite(${pin}, ${output});\n`;
};

ArduinoGenerator["pin_pwm_output"] = function (block: Block) {
  const output = block.getFieldValue("output");
  return [`${output}`, ORDER.ATOMIC];
};

ArduinoGenerator["pin_detach_interrupt"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  return `detachInterrupt(digitalPinToInterrupt(${pin}));\n`;
};

// TODO: Implemented
ArduinoGenerator["pin_attach_interrupt"] = function (block: Block) {
  const pin: string = ArduinoGenerator.valueToCode(block, "pin", ORDER.ATOMIC);
  const mode: string = block.getFieldValue("mode");
  const isr: string = ArduinoGenerator.statementToCode(block, "isr");
  return `// NOT IMPLEMENTED\n`;
  const code = "...;\n";
  return code;
};

export default {};
